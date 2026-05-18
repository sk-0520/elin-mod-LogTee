using Elin.Plugin.Generated;

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

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.SocketClientSettingIsEnabled), AllLanguage = true)]
        public virtual bool IsEnabled { get; set; }

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.SocketClientSettingPort), AllLanguage = true)]
        public virtual int Port { get; set; }

        #endregion
    }
}
