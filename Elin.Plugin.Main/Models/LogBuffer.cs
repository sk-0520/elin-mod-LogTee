using Cysharp.Threading.Tasks;
using Elin.Plugin.Main.Models.Settings;
using Elin.Plugin.Main.Models.Socket;
using Elin.Plugin.Main.PluginHelpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;

namespace Elin.Plugin.Main.Models
{
    public class LogBuffer : IDisposable
    {
        #region variable

        private readonly object _syncLogItems = new object();

        #endregion

        public LogBuffer(ILogTimeProvider logTimeProvider, SyncObject syncObject, IReadOnlyLogBufferSetting logBufferSetting, IReadOnlyLogFileSetting logFileSetting, IReadOnlySocketClientSetting socketClientSetting)
        {
            LogTimeProvider = logTimeProvider;
            SyncObject = syncObject;
            LogBufferSetting = logBufferSetting;
            LogFileSetting = logFileSetting;
            SocketClientSetting = socketClientSetting;
            Timer = new System.Timers.Timer()
            {
                Interval = LogBufferSetting.LogFlushInterval,
            };
            if (SocketClientSetting.IsEnabled)
            {
                ModHelper.WriteDev("socket client is enabled");
                SocketClient = new SocketClient(SocketClientSetting.HostName, SocketClientSetting.Port);
            }
            Timer.Elapsed += Timer_Elapsed;
            LogItems = new List<LogItem>(logBufferSetting.Capacity);
            LogFlushLimit = logBufferSetting.LogFlushLimit;
        }

        ~LogBuffer()
        {
            Dispose(disposing: false);
        }

        #region property

        private ILogTimeProvider LogTimeProvider { get; }
        private SyncObject SyncObject { get; }
        private IReadOnlyLogBufferSetting LogBufferSetting { get; }
        private IReadOnlyLogFileSetting LogFileSetting { get; }
        private IReadOnlySocketClientSetting SocketClientSetting { get; }
        private List<LogItem> LogItems { get; }
        private LogItem? LogItem { get; set; }
        private System.Timers.Timer Timer { get; }
        /// <inheritdoc cref="LogBufferSetting.LogFlushLimit"/>
        private int LogFlushLimit { get; }
        private SocketClient? SocketClient { get; }
        private CancellationTokenSource CancellationTokenSource { get; } = new CancellationTokenSource();

        private JsonSerializerSettings JsonSetting { get; } = new JsonSerializerSettings()
        {
            ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver(),
            Formatting = Formatting.None,
        };
        private TimeSpan EqualMessageSpan { get; } = TimeSpan.FromMilliseconds(250);

        #endregion

        #region function

        private bool IsSkipItem(MessageItem messageItem, DateTime logTimestamp)
        {
            if (LogItem is null)
            {
                return false;
            }

            //NOTE: ReloadOnDeath 参照のこと(実際問題これどうなんだろう)

            if (messageItem.Kind == MessageKind.Message || messageItem.Kind == MessageKind.MessageWithColor)
            {
                if (LogItem.Message.Kind != messageItem.Kind && LogItem.Message.Message == messageItem.Message)
                {
                    return true;
                }

                //NOTE: ReloadOnDeath から少し拡張
                if (LogItem.Message.Message is not null && messageItem.Message is not null)
                {
                    if (logTimestamp - LogItem.LogTimestamp < EqualMessageSpan)
                    {
                        if (LogItem.Message.Message.Trim() == messageItem.Message.Trim())
                        {
                            return true;
                        }
                    }
                }

            }

            return false;
        }

        private bool IsOverwriteItem(MessageItem messageItem)
        {
            if (LogItems.Count == 0)
            {
                return false;
            }
            if (messageItem.Kind != MessageKind.Color)
            {
                return false;
            }

            var lastItem = LogItems[LogItems.Count - 1].Message;
            if (messageItem.Kind != lastItem.Kind)
            {
                return false;
            }

            return true;
        }

        public void Add(LogItem item)
        {
            bool shouldFlushNow;

            lock (this._syncLogItems)
            {
                if (IsSkipItem(item.Message, item.LogTimestamp))
                {
                    return;
                }

                LogItem = item;

                if (IsOverwriteItem(item.Message))
                {
                    LogItems[LogItems.Count - 1] = item;
                }
                else
                {
                    LogItems.Add(item);
                }

                shouldFlushNow = LogFlushLimit <= LogItems.Count;
            }

            if (shouldFlushNow)
            {
                Flush();
            }
            else
            {
                DelayFlush();
            }
        }

        private void DelayFlush()
        {
            Timer.Stop();
            Timer.Start();
        }

        private UniTask FlushLogFileAsync(LogFilePath logFilePath, string[] lines, CancellationToken cancellationToken)
        {
            //ModHelper.WriteDev($"FlushLogFileAsync: {logFilePath.Full}");
            return UniTask.RunOnThreadPool(() =>
            {
                if (!Directory.Exists(logFilePath.Directory))
                {
                    //ModHelper.WriteDev($"CreateDirectory: {logFilePath.Directory}");
                    Directory.CreateDirectory(logFilePath.Directory);
                }

                //ModHelper.WriteDev($"writing...");

                lock (SyncObject.LogFile)
                {
                    File.AppendAllLines(logFilePath.Full, lines, Encoding.UTF8);
                }

                //ModHelper.WriteDev($"write!");

            }, cancellationToken: cancellationToken);
        }

        private UniTask FlushSocketAsync(string[] lines, CancellationToken cancellationToken)
        {
            return UniTask.RunOnThreadPool(() =>
            {
                System.Diagnostics.Debug.Assert(SocketClient is not null);

                //ModHelper.WriteDev("socket!!!!");

                lock (SyncObject.SocketClient)
                {
                    foreach (var logLine in lines)
                    {
                        //ModHelper.WriteDev(logLine);
                        SocketClient!.Send(logLine + Environment.NewLine);
                    }
                }

                //ModHelper.WriteDev("socket sent");
            }, cancellationToken: cancellationToken);
        }

        private void FlushCore()
        {
            string[] logLines;
            lock (this._syncLogItems)
            {
                if (LogItems.Count == 0)
                {
                    return;
                }
                logLines = LogItems
                    .Select(a => JsonConvert.SerializeObject(a, JsonSetting))
                    .ToArray()
                ;
                LogItems.Clear();
            }

            if (LogFileSetting.IsEnabled && !string.IsNullOrWhiteSpace(LogFileSetting.FilePath))
            {
                //ModHelper.WriteDev("LogFile");
                var logFilePath = LogFileUtility.BuildLogFilePath(LogFileSetting.FilePath, LogTimeProvider);
                FlushLogFileAsync(logFilePath, logLines, CancellationTokenSource.Token).Forget();
            }

            if (SocketClient is not null)
            {
                //ModHelper.WriteDev("SocketClient");
                FlushSocketAsync(logLines, CancellationTokenSource.Token).Forget();
            }
        }

        private void Flush()
        {
            Timer.Stop();
            try
            {
                FlushCore();
            }
            finally
            {
                Timer.Start();
            }
        }

        #endregion

        #region IDisposable

        private bool _isDisposedValue;

        protected virtual void Dispose(bool disposing)
        {
            if (!this._isDisposedValue)
            {
                if (Timer.Enabled)
                {
                    Timer.Stop();
                }

                FlushCore();

                if (disposing)
                {
                    Timer.Dispose();
                    SocketClient?.Dispose();
                }

                this._isDisposedValue = true;
            }
        }

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        #endregion

        private void Timer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            Flush();
        }
    }
}
