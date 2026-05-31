using Elin.Plugin.Main.Models.Settings;

namespace Elin.Plugin.Main.Models.Web.Runner.ApiData
{
    public class SettingResponse
    {
        #region property

        public Setting? Setting { get; set; } // required init したいにゃぁ

        public Setting? Default { get; set; }

        #endregion
    }
}
