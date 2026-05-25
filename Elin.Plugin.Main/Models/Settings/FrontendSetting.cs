using Elin.Plugin.Generated;

namespace Elin.Plugin.Main.Models.Settings
{
    public interface IReadOnlyFrontendSetting
    {
        #region property

        string CssFontFamily { get; }
        string CssFontSize { get; }

        int ElementLimit { get; }

        string Highlight { get; }

        #endregion
    }

    public partial class FrontendSetting : IReadOnlyFrontendSetting
    {
        #region IReadOnlyFrontendSetting

        public virtual string CssFontFamily { get; set; } = string.Empty;
        public virtual string CssFontSize { get; set; } = string.Empty;
        public virtual int ElementLimit { get; set; }

        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.FrontendSettingHighlight), AllLanguage = true)]
        public virtual string Highlight { get; set; } = string.Empty;

        #endregion
    }
}
