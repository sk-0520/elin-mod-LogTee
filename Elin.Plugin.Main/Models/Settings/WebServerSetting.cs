namespace Elin.Plugin.Main.Models.Settings
{
    public partial interface IReadOnlyWebServerSetting
    {
        #region property

        bool IsEnabled { get; }
        int Port { get; }
        bool OpenBrowserOnStartup { get; }

        #endregion
    }

    public partial class WebServerSetting : IReadOnlyWebServerSetting
    {
        #region IReadOnlyWebServerSetting

        public virtual bool IsEnabled { get; set; }
        virtual public int Port { get; set; }
        virtual public bool OpenBrowserOnStartup { get; set; }

        #endregion
    }
}
