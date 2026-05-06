namespace Elin.Plugin.Main.Models.Settings
{
    public interface IReadOnlySocketClientSetting
    {
        #region property
        bool IsEnabled { get; }
        int Port { get; }

        #endregion
    }

    public partial class SocketClientSetting : IReadOnlySocketClientSetting
    {
        #region IReadOnlySocketClientSetting

        public virtual bool IsEnabled { get; set; }
        public virtual int Port { get; set; }

        #endregion
    }
}
