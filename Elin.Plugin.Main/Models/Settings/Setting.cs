using Elin.Plugin.Generated;

namespace Elin.Plugin.Main.Models.Settings
{
    [GeneratePluginConfig]
    public partial class Setting
    {
        #region property

        internal static Setting Instance { get; set; } = new Setting();

        public LogBufferSetting LogBufferSetting { get; set; } = new LogBufferSetting()
        {
            Capacity = 32,
            LogFlushLimit = 30,
        };

        public LogFileSetting LogFile { get; set; } = new LogFileSetting()
        {
            IsEnabled = false,
            FilePath = string.Empty
        };

        public SocketServerSetting SocketServer { get; set; } = new SocketServerSetting()
        {
            IsEnabled = true,
            Port = 60100,
            Capacity = 256,
        };

        public SocketClientSetting SocketClient { get; set; } = new SocketClientSetting()
        {
            IsEnabled = true,
            Port = 60100
        };

        public WebServerSetting WebServer { get; set; } = new WebServerSetting()
        {
            IsEnabled = true,
            Port = 60080,
            OpenBrowserOnStartup = true,
        };

        #endregion
    }
}
