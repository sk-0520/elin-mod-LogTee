using Elin.Plugin.Generated;

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

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.WebServerSettingIsEnabled), AllLanguage = true)]
        public virtual bool IsEnabled { get; set; }

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.WebServerSettingPort), AllLanguage = true)]
        virtual public int Port { get; set; }

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.WebServerSettingOpenBrowserOnStartup), AllLanguage = true)]
        virtual public bool OpenBrowserOnStartup { get; set; }

        #endregion
    }
}
