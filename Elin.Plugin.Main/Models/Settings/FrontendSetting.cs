namespace Elin.Plugin.Main.Models.Settings
{
    public interface IReadOnlyFrontendSetting
    {
        #region property

        string CssFontFamily { get; }
        string CssFontSize { get; }

        #endregion
    }

    public partial class FrontendSetting : IReadOnlyFrontendSetting
    {
        #region IReadOnlyFrontendSetting

        public virtual string CssFontFamily { get; set; } = string.Empty;
        public virtual string CssFontSize { get; set; } = string.Empty;

        #endregion
    }
}
