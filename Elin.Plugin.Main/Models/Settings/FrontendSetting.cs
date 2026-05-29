using Elin.Plugin.Generated;

namespace Elin.Plugin.Main.Models.Settings
{
    public interface IReadOnlyFrontendSetting
    {
        #region property

        string CssFontFamily { get; }
        string CssFontSize { get; }

        int ElementLimit { get; }

        string HighlightV2 { get; }

        #endregion
    }

    public partial class FrontendSetting : IReadOnlyFrontendSetting
    {
        #region IReadOnlyFrontendSetting

        public virtual string CssFontFamily { get; set; } = string.Empty;
        public virtual string CssFontSize { get; set; } = string.Empty;
        public virtual int ElementLimit { get; set; }

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.FrontendSettingHighlightV2), AllLanguage = true)]
        public virtual string HighlightV2 { get; set; } = string.Empty;

        #endregion
    }
}
