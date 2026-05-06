using Cysharp.Threading.Tasks;
using Elin.Plugin.Main.Models.Web;
using System.Net;
using System.Threading;

namespace Elin.Plugin.Main.Models.Web.Runner
{
    public abstract class RunnerBase
    {
        protected RunnerBase(IReadOnlyWebServerOptions options)
        {
            Options = options;
        }

        #region property

        protected IReadOnlyWebServerOptions Options { get; }

        #endregion

        #region function

        public abstract UniTask RunAsync(HttpListenerContext context, CancellationToken cancellationToken);

        #endregion
    }
}
