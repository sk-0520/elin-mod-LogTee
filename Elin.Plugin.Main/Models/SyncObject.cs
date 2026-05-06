using System;

namespace Elin.Plugin.Main.Models
{
    public class SyncObject : IDisposable
    {
        #region property

        public readonly object LogFile = new object();

        public readonly object SocketClient = new object();

        #endregion

        #region IDisposable

        private bool _isDisposedValue;

        protected virtual void Dispose(bool disposing)
        {
            if (!this._isDisposedValue)
            {
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
