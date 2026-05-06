namespace Elin.Plugin.Main.Models.Settings
{
    public interface IReadOnlySocketServerSetting
    {
        #region property
        bool IsEnabled { get; }
        int Port { get; }
        int Capacity { get; }

        #endregion
    }

    public partial class SocketServerSetting : IReadOnlySocketServerSetting
    {
        #region IReadOnlySocketServerSetting

        public virtual bool IsEnabled { get; set; }
        public virtual int Port { get; set; }
        public virtual int Capacity { get; set; }

        #endregion
    }
}
