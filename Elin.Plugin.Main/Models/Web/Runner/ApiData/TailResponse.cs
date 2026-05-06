using System;

namespace Elin.Plugin.Main.Models.Web.Runner.ApiData
{
    public class TailResponse
    {
        #region property

        public LogItem[] LogItems { get; set; } = Array.Empty<LogItem>();

        #endregion
    }
}
