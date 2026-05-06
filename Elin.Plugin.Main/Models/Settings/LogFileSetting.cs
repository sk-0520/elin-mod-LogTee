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

        public virtual bool IsEnabled { get; set; }
        public virtual string FilePath { get; set; } = string.Empty;

        #endregion
    }
}
