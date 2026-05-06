using Cysharp.Threading.Tasks;
using Elin.Plugin.Main.PluginHelpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Sockets;
using System.Threading;

namespace Elin.Plugin.Main.Models.Socket
{
    public class SocketServer : IDisposable
    {
        public SocketServer(int port, int logCapacity)
        {
            TcpListener = new TcpListener(System.Net.IPAddress.Any, port);
            LogCapacity = logCapacity;
            LogItems = new Queue<LogItem>(LogCapacity);
        }

        ~SocketServer()
        {
            Dispose(disposing: false);
        }

        #region property

        private int LogCapacity { get; }
        private TcpListener TcpListener { get; }
        public Queue<LogItem> LogItems { get; }
        private CancellationTokenSource CancellationTokenSource { get; } = new();

        #endregion

        #region function

        private async UniTask ProcessAsync(TcpClient tcpClient, CancellationToken cancellationToken)
        {
            using var stream = tcpClient.GetStream();
            using var reader = new StreamReader(stream);

            while (tcpClient.Connected && !cancellationToken.IsCancellationRequested)
            {
                var line = await reader.ReadLineAsync().ConfigureAwait(false);
                if (line is null)
                {
                    ModHelper.WriteDev("Connection closed by client.");
                    continue;
                }
                //ModHelper.WriteDev(line);
                var logItem = JsonConvert.DeserializeObject<LogItem>(line);
                LogItems.Enqueue(logItem);

                // あまりにもため込むとダメなので容量越えを破棄
                while (LogCapacity < LogItems.Count)
                {
                    LogItems.Dequeue();
                }
            }
        }

        public async UniTask StartAsync()
        {
            TcpListener.Start();

            while (true)
            {
                ModHelper.WriteDev("Waiting for a connection...");

                var tcpClient = await TcpListener.AcceptTcpClientAsync();

                ModHelper.WriteDev("Connection accepted.");

                UniTask.Create(async () => await ProcessAsync(tcpClient, CancellationTokenSource.Token)).Forget();
            }
        }

        public void Stop()
        {
            TcpListener.Stop();
        }

        #endregion

        #region IDisposable

        private bool _isDisposedValue;

        protected virtual void Dispose(bool disposing)
        {
            if (!this._isDisposedValue)
            {
                if (disposing)
                {
                    CancellationTokenSource.Cancel();
                    CancellationTokenSource.Dispose();
                    TcpListener.Stop();
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

    }
}
