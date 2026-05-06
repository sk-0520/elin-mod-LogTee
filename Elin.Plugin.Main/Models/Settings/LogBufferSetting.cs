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

        public virtual int Capacity { get; set; }
        public virtual int LogFlushLimit { get; set; }

        #endregion
    }
}
