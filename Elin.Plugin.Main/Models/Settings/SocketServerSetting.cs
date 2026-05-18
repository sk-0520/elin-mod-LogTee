using Elin.Plugin.Generated;

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

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.SocketServerSettingIsEnabled), AllLanguage = true)]
        public virtual bool IsEnabled { get; set; }

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.SocketServerSettingPort), AllLanguage = true)]
        public virtual int Port { get; set; }

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.SocketServerSettingCapacity), AllLanguage = true)]
        public virtual int Capacity { get; set; }

        #endregion
    }
}
