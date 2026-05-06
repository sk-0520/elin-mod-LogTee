using Cysharp.Threading.Tasks;
using Elin.Plugin.Main.PluginHelpers;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Threading;

namespace Elin.Plugin.Main.Models.Web.Runner
{
    public class StaticFileRunner : RunnerBase
    {
        public StaticFileRunner(IReadOnlyWebServerOptions options)
            : base(options)
        { }


        #region property

        private static StringComparison FileStringComparison
        {
            get
            {
                return RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
                    ? StringComparison.OrdinalIgnoreCase
                    : StringComparison.Ordinal
                ;
            }
        }

        #endregion

        #region function

        private static string ToLocalFilePath(string webRootPath, string urlPath)
        {
            var relPath = urlPath.Replace('/', Path.DirectorySeparatorChar).Trim(Path.DirectorySeparatorChar);
            ModHelper.LogDev(relPath);
            var absPath = Path.Combine(webRootPath, string.IsNullOrEmpty(relPath) ? "index.html" : relPath);
            ModHelper.LogDev(absPath);

            return absPath;
        }

        private async UniTask RunStaticFileAsync(FileInfo fileInfo, HttpListenerContext context, CancellationToken cancellationToken)
        {
            if (!fileInfo.Exists)
            {
                ModHelper.LogDev("404");

                throw new WebServerException(HttpStatusCode.NotFound, context.Request.RawUrl);
            }

            var mime = Options.Mimes.FirstOrDefault(a => a.Regex.IsMatch(fileInfo.FullName));
            if (mime is not null)
            {
                ModHelper.LogDev(mime);

                context.Response.ContentType = mime.Value;
            }
            else
            {
                ModHelper.LogDev("unknown mime type");
            }

            context.Response.ContentLength64 = fileInfo.Length;
            context.Response.StatusCode = (int)HttpStatusCode.OK;

            if (context.Request.HttpMethod == "GET")
            {
                using var fileStream = fileInfo.OpenRead();
                await fileStream.CopyToAsync(context.Response.OutputStream, 81920, cancellationToken);
                ModHelper.LogDev("!!FILE!!");
            }
            else if (context.Request.HttpMethod != "HEAD")
            {
                throw new WebServerException(HttpStatusCode.MethodNotAllowed, context.Request.RawUrl);
            }
        }

        #endregion

        #region RunnerBase

        public override async UniTask RunAsync(HttpListenerContext context, CancellationToken cancellationToken)
        {
            ModHelper.LogDev(context.Request.RawUrl);

            var localFilePath = ToLocalFilePath(Options.WebRoot.FullName, context.Request.Url.LocalPath);

            if (localFilePath.StartsWith(Options.WebRoot.FullName, FileStringComparison))
            {
                ModHelper.LogDev("FILE!");

                var fileInfo = new FileInfo(localFilePath);
                fileInfo.Refresh();

                await RunStaticFileAsync(fileInfo, context, cancellationToken);
                return;
            }

            // ここに来たらディレクトリトラバーサル

            throw new WebServerException(HttpStatusCode.BadRequest, context.Request.RawUrl);
        }

        #endregion
    }
}
