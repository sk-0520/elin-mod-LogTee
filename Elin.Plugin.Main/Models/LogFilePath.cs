using System.IO;

namespace Elin.Plugin.Main.Models
{
    public record class LogFilePath
    {
        public LogFilePath(string directory, string file)
        {
            Directory = directory;
            File = file;
            Full = Path.Combine(Directory, File);
        }

        #region property

        public string Directory { get; }
        public string File { get; }
        public string Full { get; }

        #endregion
    }
}
