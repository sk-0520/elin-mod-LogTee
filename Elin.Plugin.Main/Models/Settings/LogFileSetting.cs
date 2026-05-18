using Elin.Plugin.Generated;

namespace Elin.Plugin.Main.Models.Settings
{
    public interface IReadOnlyLogFileSetting
    {
        #region property

        bool IsEnabled { get; }
        string FilePath { get; }

        #endregion
    }

    public partial class LogFileSetting : IReadOnlyLogFileSetting
    {
        #region IReadOnlyLogFileSetting

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.LogFileSettingIsEnabled), AllLanguage = true)]
        public virtual bool IsEnabled { get; set; }

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.LogFileSettingFilePath), AllLanguage = true)]
        public virtual string FilePath { get; set; } = string.Empty;

        #endregion
    }
}
