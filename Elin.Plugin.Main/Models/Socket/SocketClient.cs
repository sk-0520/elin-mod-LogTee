using System;
using System.Net.Sockets;

namespace Elin.Plugin.Main.Models.Socket
{
    public class SocketClient : IDisposable
    {
        public SocketClient(string hostname, int port)
        {
            TcpClient = new TcpClient(hostname, port);
            Stream = TcpClient.GetStream();
        }

        ~SocketClient()
        {
            Dispose(disposing: false);
        }

        #region property

        private TcpClient TcpClient { get; }
        private NetworkStream Stream { get; }

        #endregion

        #region function

        private static byte[] ToBinary(string s)
        {
            return System.Text.Encoding.UTF8.GetBytes(s);
        }

        public void Send(byte[] binary)
        {
            Stream.Write(binary, 0, binary.Length);
        }

        public void Send(string message)
        {
            var bytes = ToBinary(message);
            Send(bytes);
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
                    Stream.Dispose();
                    TcpClient.Dispose();
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
