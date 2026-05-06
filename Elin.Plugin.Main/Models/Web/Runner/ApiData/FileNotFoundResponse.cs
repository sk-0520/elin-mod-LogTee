namespace Elin.Plugin.Main.Models.Web.Runner.ApiData
{
    public class FileNotFoundResponse
    {
        public FileNotFoundResponse(string path)
        {
            Path = path;
        }

        #region property

        public string Path { get; }

        #endregion
    }
}
