using Cysharp.Threading.Tasks;
using Elin.Plugin.Main.Models.Settings;
using Elin.Plugin.Main.Models.Web.Runner.ApiData;
using Elin.Plugin.Main.PluginHelpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;

namespace Elin.Plugin.Main.Models.Web.Runner
{
    public class ApiRunner : RunnerBase
    {
        public ApiRunner(IReadOnlyLogFileSetting logFileSetting, ILogTimeProvider logTimeProvider, SyncObject syncObject, Queue<LogItem>? logItems, IReadOnlyWebServerOptions options)
            : base(options)
        {
            LogFileSetting = logFileSetting;
            LogTimeProvider = logTimeProvider;
            SyncObject = syncObject;
            LogItems = logItems;
            Routings = new[]
            {
                new Routing("GET", "/api/tail", TailAsync),
                new Routing("GET", "/api/stream/file", StreamFileAsync),
                new Routing("GET", "/api/stream/socket", StreamSocketAsync),
                new Routing("GET", "/api/setting", GetSettingAsync),
                new Routing("POST", "/api/setting", PostSettingAsync),
                new Routing("POST", "/api/setting/reset", ResetSettingAsync),
            };
        }

        #region property

        private IReadOnlyLogFileSetting LogFileSetting { get; }
        private ILogTimeProvider LogTimeProvider { get; }
        private SyncObject SyncObject { get; }
        private Queue<LogItem>? LogItems { get; }
        private Routing[] Routings { get; }
        private TimeSpan StreamDelay { get; } = TimeSpan.FromMilliseconds(750);

        private JsonSerializerSettings JsonSerializerSettings { get; } = new JsonSerializerSettings
        {
            ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver(),
            Formatting = Formatting.None,
        };

        private static string SseContentType => "text/event-stream";

        #endregion

        #region function

        private void ApplyEventStreamHeaders(HttpListenerContext context)
        {
            context.Response.ContentType = SseContentType;
            context.Response.Headers.Add("Cache-Control", "no-cache");
            context.Response.Headers.Add("Connection", "keep-alive");
        }

        private async UniTask WriteResponseAsync<T>(HttpListenerContext context, T response, HttpStatusCode httpStatusCode = HttpStatusCode.OK, CancellationToken cancellationToken = default)
        {
            var json = JsonConvert.SerializeObject(response, JsonSerializerSettings);
            var buffer = System.Text.Encoding.UTF8.GetBytes(json);
            context.Response.ContentType = "application/json";
            context.Response.ContentEncoding = System.Text.Encoding.UTF8;
            context.Response.ContentLength64 = buffer.Length;
            await context.Response.OutputStream.WriteAsync(buffer, 0, buffer.Length, cancellationToken);
        }

        private async UniTask WriteStreamAsync(HttpListenerContext context, string line, CancellationToken cancellationToken)
        {
            var binary = Encoding.UTF8.GetBytes($"data: {line}\n\n");
            await context.Response.OutputStream.WriteAsync(binary, 0, binary.Length, cancellationToken).ConfigureAwait(false);
            await context.Response.OutputStream.FlushAsync(cancellationToken).ConfigureAwait(false);
        }

        private async UniTask TailAsync(System.Net.HttpListenerContext context, System.Threading.CancellationToken cancellationToken)
        {
            var logFilePath = LogFileUtility.BuildLogFilePath(LogFileSetting.FilePath, LogTimeProvider);

            if (!File.Exists(logFilePath.Full))
            {
                throw new WebServerException(HttpStatusCode.NotFound)
                {
                    Json = new FileNotFoundResponse(logFilePath.Full),
                };
            }

            var tailCount = 20;
            string[] logs;
            lock (SyncObject.LogFile)
            {
                logs = LogFileUtility.Tail(logFilePath.Full, tailCount);
            }

            var response = new TailResponse
            {
                LogItems = logs.Select(a => JsonConvert.DeserializeObject<LogItem>(a, JsonSerializerSettings)).ToArray(),
            };
            await WriteResponseAsync(context, response, cancellationToken: cancellationToken);
        }

        private async UniTask StreamFileAsync(System.Net.HttpListenerContext context, System.Threading.CancellationToken cancellationToken)
        {
            static FileStream OpenFile(string path)
            {
                return new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            }

            static StreamReader CreateReader(Stream stream)
            {
                return new StreamReader(stream, System.Text.Encoding.UTF8, true, 4 * 1024, true);
            }

            var logFilePath = LogFileUtility.BuildLogFilePath(LogFileSetting.FilePath, LogTimeProvider);
            if (!File.Exists(logFilePath.Full))
            {
                throw new WebServerException(HttpStatusCode.NotFound)
                {
                    Json = new FileNotFoundResponse(logFilePath.Full),
                };
            }

            ApplyEventStreamHeaders(context);

            Stream? stream = OpenFile(logFilePath.Full);
            stream.Seek(0, SeekOrigin.End);
            var currentPosition = stream.Position;

            while (true)
            {
                var currentFilePath = LogFileUtility.BuildLogFilePath(LogFileSetting.FilePath, LogTimeProvider);
                if (currentFilePath.Full != logFilePath.Full)
                {
                    // 読み込み対象ファイルが変わったので差し替える

                    ModHelper.WriteDev($"change file: {logFilePath.Full} -> {currentFilePath.Full}");

                    // ストリームあり = 前のファイルが存在していた
                    if (stream is not null)
                    {
                        // ファイル差し替え前に読めるだけ読んでおく
                        if (stream.Length != currentPosition)
                        {
                            string block;
                            using (var reader = CreateReader(stream))
                            {
                                block = await reader.ReadToEndAsync();
                            }
                            if (block != string.Empty)
                            {
                                var lines = ModHelper.Common.ReadLines(block);
                                foreach (var line in lines)
                                {
                                    await WriteStreamAsync(context, line, cancellationToken);
                                }
                            }
                        }
                        stream.Dispose();
                        stream = null;
                    }

                    logFilePath = currentFilePath;
                    if (!File.Exists(currentFilePath.Full))
                    {
                        continue;
                    }

                    stream = OpenFile(logFilePath.Full);
                    currentPosition = 0;
                }
                else if (stream is not null)
                {
                    if (stream.Length == currentPosition)
                    {
                        ModHelper.WriteDev($"stream.Length: {stream.Length}, currentPosition: {currentPosition}");

                        await WriteStreamAsync(context, string.Empty, cancellationToken);
                        await UniTask.Delay(StreamDelay, cancellationToken: cancellationToken);
                        continue;
                    }
                }
                else if (stream is null)
                {
                    if (!File.Exists(currentFilePath.Full))
                    {
                        ModHelper.WriteDev("監視中ファイル未生成");
                        await WriteStreamAsync(context, string.Empty, cancellationToken);
                        await UniTask.Delay(StreamDelay, cancellationToken: cancellationToken);
                        continue;
                    }

                    logFilePath = currentFilePath;
                    stream = OpenFile(logFilePath.Full);
                    currentPosition = 0;
                }

                ModHelper.WriteDev($"logFilePath: {logFilePath.Full}");

                using (var reader = CreateReader(stream))
                {
                    ModHelper.WriteDev("stream start");
                    while (true)
                    {
                        var line = await reader.ReadLineAsync();
                        if (line is null)
                        {
                            ModHelper.WriteDev($"stream break");

                            break;
                        }

                        ModHelper.WriteDev($"stream line: {line}");

                        await WriteStreamAsync(context, line, cancellationToken);
                    }
                }
                currentPosition = stream.Position;
            }
        }

        private async UniTask StreamSocketAsync(System.Net.HttpListenerContext context, System.Threading.CancellationToken cancellationToken)
        {
            if (LogItems is null)
            {
                throw new WebServerException(HttpStatusCode.InternalServerError, "Socket is not connected.");
            }

            ApplyEventStreamHeaders(context);

            while (true)
            {
                if (LogItems.Count == 0)
                {
                    await WriteStreamAsync(context, string.Empty, cancellationToken);
                    await UniTask.Delay(StreamDelay, cancellationToken: cancellationToken);
                    continue;
                }

                LogItem? logItem;
                while ((logItem = LogItems.Dequeue()) is not null)
                {
                    var json = JsonConvert.SerializeObject(logItem, JsonSerializerSettings);
                    //ModHelper.WriteDev($"stream json: {json}");
                    await WriteStreamAsync(context, json, cancellationToken);
                }
            }
        }

        private async UniTask GetSettingAsync(System.Net.HttpListenerContext context, System.Threading.CancellationToken cancellationToken)
        {
            var response = new SettingResponse
            {
                Setting = ModHelper.Plugin.SettingProxy,
            };
            await WriteResponseAsync(context, response, cancellationToken: cancellationToken);
        }

        private async UniTask PostSettingAsync(System.Net.HttpListenerContext context, System.Threading.CancellationToken cancellationToken)
        {
            string rawRequestBody;
            using (var reader = new StreamReader(context.Request.InputStream, context.Request.ContentEncoding))
            {
                rawRequestBody = await reader.ReadToEndAsync();
            }
            var request = JsonConvert.DeserializeObject<SettingRequest>(rawRequestBody, JsonSerializerSettings);

            var reqSetting = request.Setting;

            var settingProxy = ModHelper.Plugin.SettingProxy;
            ModHelper.LogDev($"1 setting: {JsonConvert.SerializeObject(settingProxy, JsonSerializerSettings)}");
            ModHelper.LogDev($"2 setting: {JsonConvert.SerializeObject(reqSetting, JsonSerializerSettings)}");

            ObjectUtility.CopySetting(reqSetting, settingProxy);

            ModHelper.LogDev($"3 setting: {JsonConvert.SerializeObject(settingProxy, JsonSerializerSettings)}");

            var response = new SimpleResultResponse
            {
                Success = true,
            };
            await WriteResponseAsync(context, response, cancellationToken: cancellationToken);
        }

        private async UniTask ResetSettingAsync(System.Net.HttpListenerContext context, System.Threading.CancellationToken cancellationToken)
        {
            ModHelper.Plugin.SettingProxy.Reset();

            var response = new SimpleResultResponse
            {
                Success = true,
            };
            await WriteResponseAsync(context, response, cancellationToken: cancellationToken);
        }

        #endregion

        #region RunnerBase

        public override UniTask RunAsync(System.Net.HttpListenerContext context, System.Threading.CancellationToken cancellationToken)
        {
            var path = context.Request.Url.LocalPath;

            ModHelper.LogDev($"[{context.Request.HttpMethod}] path: {path}");

            var targetRoutings = Routings.Where(a => a.Path == path);
            if (!targetRoutings.Any())
            {
                throw new WebServerException(HttpStatusCode.NotFound);
            }

            // TODO: ここでヘッダ書き込みするとだめやもしれん
            var methods = targetRoutings.Select(a => a.HttpMethod).ToList();
            methods.Insert(0, "OPTIONS");
            context.Response.Headers.Add("Allow", string.Join(", ", methods));
            context.Response.Headers.Add("Access-Control-Request-Method", string.Join(", ", methods));
            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            context.Response.Headers.Add("Access-Control-Allow-Headers", "*");

            if (context.Request.HttpMethod == "OPTIONS")
            {
                context.Response.StatusCode = (int)HttpStatusCode.NoContent;
                return UniTask.CompletedTask;
            }

            var targetRouting = targetRoutings.FirstOrDefault(a => a.HttpMethod == context.Request.HttpMethod);
            if (targetRouting is null)
            {
                throw new WebServerException(HttpStatusCode.MethodNotAllowed, $"[{context.Request.HttpMethod}]: {context.Request.RawUrl}");
            }

            return targetRouting.Func(context, cancellationToken);
        }

        #endregion
    }
}
