using Cysharp.Threading.Tasks;
using System;
using System.Net;
using System.Threading;

namespace Elin.Plugin.Main.Models.Web
{
    public class Routing
    {
        public Routing(string httpMethod, string path, Func<HttpListenerContext, CancellationToken, UniTask> func)
        {
            HttpMethod = httpMethod;
            Path = path;
            Func = func;
        }

        #region property

        public string HttpMethod { get; }
        public string Path { get; }
        public Func<HttpListenerContext, CancellationToken, UniTask> Func { get; }

        #endregion
    }
}
