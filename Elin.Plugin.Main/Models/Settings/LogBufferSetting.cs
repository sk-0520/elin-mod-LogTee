using Elin.Plugin.Generated;

namespace Elin.Plugin.Main.Models.Settings
{
    public interface IReadOnlyLogBufferSetting
    {
        #region property

        int Capacity { get; }
        int LogFlushLimit { get; }

        #endregion
    }

    public partial class LogBufferSetting : IReadOnlyLogBufferSetting
    {
        #region IReadOnlyLogBufferSetting

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.LogBufferSettingCapacity), AllLanguage = true)]
        public virtual int Capacity { get; set; }

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.LogBufferSettingLogFlushLimit), AllLanguage = true)]
        public virtual int LogFlushLimit { get; set; }

        #endregion
    }
}
