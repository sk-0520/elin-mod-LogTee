using Elin.Plugin.Generated;

namespace Elin.Plugin.Main.Models.Settings
{
    [GeneratePluginConfig]
    public partial class Setting
    {
        #region property

        internal static Setting Instance { get; set; } = new Setting();

        public LogBufferSetting LogBuffer { get; set; } = new LogBufferSetting()
        {
            Capacity = 32,
            LogFlushLimit = 32,
            LogFlushInterval = 250,
        };

        public LogFileSetting LogFile { get; set; } = new LogFileSetting()
        {
            IsEnabled = false,
            FilePath = string.Empty
        };

        public SocketClientSetting SocketClient { get; set; } = new SocketClientSetting()
        {
            IsEnabled = true,
            HostName = "localhost",
            Port = 60100
        };

        public SocketServerSetting SocketServer { get; set; } = new SocketServerSetting()
        {
            IsEnabled = true,
            Port = 60100,
            Capacity = 256,
        };

        public WebServerSetting WebServer { get; set; } = new WebServerSetting()
        {
            IsEnabled = true,
            Port = 60080,
            OpenBrowserOnStartup = true,
        };

        public FrontendSetting Frontend { get; set; } = new FrontendSetting()
        {
            CssFontFamily = "sans-serif",
            CssFontSize = "12pt",
            ElementLimit = 4 * 1024,
        };

        #endregion
    }
}
