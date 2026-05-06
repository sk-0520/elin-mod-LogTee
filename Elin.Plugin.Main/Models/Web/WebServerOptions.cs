using System.Collections.Generic;
using System.IO;

namespace Elin.Plugin.Main.Models.Web
{
    public interface IReadOnlyWebServerOptions
    {
        #region property

        DirectoryInfo WebRoot { get; }
        IReadOnlyList<Mime> Mimes { get; }

        #endregion
    }

    public class WebServerOptions : IReadOnlyWebServerOptions
    {
        #region property

        public DirectoryInfo WebRoot { get; set; } = default!;

        public List<Mime> Mimes { get; set; } = new();
        IReadOnlyList<Mime> IReadOnlyWebServerOptions.Mimes => Mimes;

        #endregion
    }
}
