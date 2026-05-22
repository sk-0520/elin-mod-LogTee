using Cysharp.Threading.Tasks;
using Elin.Plugin.Main.Models.Settings;
using Elin.Plugin.Main.Models.Web.Runner;
using Elin.Plugin.Main.PluginHelpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace Elin.Plugin.Main.Models.Web
{
    public class WebServer : IDisposable
    {
        public WebServer(IReadOnlyLogFileSetting logFileSetting, IReadOnlyWebServerSetting webServerSetting, SyncObject syncObject, ILogTimeProvider logTimeProvider, Queue<LogItem>? logItems, IReadOnlyWebServerOptions webServerOptions)
        {
            LogFileSetting = logFileSetting;
            WebServerSetting = webServerSetting;
            LogTimeProvider = logTimeProvider;
            LogItems = logItems;
            Options = webServerOptions;

            HttpListener = new HttpListener();
            HttpListener.Prefixes.Add($"http://*:{WebServerSetting.Port}/");

            ApiRunner = new ApiRunner(LogFileSetting, LogTimeProvider, syncObject, LogItems, Options);
            StaticFileRunner = new StaticFileRunner(Options);
        }

        ~WebServer()
        {
            Dispose(disposing: false);
        }

        #region property

        private JsonSerializerSettings JsonSerializerSettings { get; } = new JsonSerializerSettings
        {
            ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver(),
            Formatting = Formatting.None,
        };

        private IReadOnlyLogFileSetting LogFileSetting { get; }
        private IReadOnlyWebServerSetting WebServerSetting { get; }
        private HttpListener HttpListener { get; }
        private ILogTimeProvider LogTimeProvider { get; }
        private Queue<LogItem>? LogItems { get; }
        private IReadOnlyWebServerOptions Options { get; }
        private CancellationTokenSource CancellationTokenSource { get; } = new CancellationTokenSource();

        private ApiRunner ApiRunner { get; }
        private StaticFileRunner StaticFileRunner { get; }

        #endregion

        #region function

        private async UniTask ProcessAsync(HttpListenerContext context, CancellationToken cancellationToken)
        {
            ModHelper.LogDev(context.Request.RawUrl);

            var isApi = context.Request.RawUrl.StartsWith("/api");

            try
            {
                if (isApi)
                {
                    await ApiRunner.RunAsync(context, cancellationToken);
                    return;
                }

                await StaticFileRunner.RunAsync(context, cancellationToken);
            }
            catch (SocketException ex)
            {
                // ソケット系は多分何もできることはないので無視でよろし
                ModHelper.WriteDev(ex);
            }
            catch (Exception ex)
            {
                // Web サーバーとしては落ちられると困るのでキャッチ内処理例外は握りつぶす
                try
                {
                    ModHelper.WriteDev(ex);

                    // TODO: ヘッダ送信済みのフラグどっかないのか要調査
                    if (ex is WebServerException webServerException)
                    {
                        context.Response.StatusCode = (int)webServerException.HttpStatusCode;
                        context.Response.StatusDescription = webServerException.StatusDescription;
                    }

                    if (context.Response.StatusCode != (int)HttpStatusCode.NotFound)
                    {
                        ModHelper.LogNotExpected(ex);
                    }

                    if (isApi && ex is WebServerException webServerExceptionBody && webServerExceptionBody.Json is not null)
                    {
                        context.Response.ContentType = "application/json";
                        var json = JsonConvert.SerializeObject(webServerExceptionBody.Json, JsonSerializerSettings);
                        var body = Encoding.UTF8.GetBytes(json);
                        await context.Response.OutputStream.WriteAsync(body, 0, body.Length, cancellationToken);
                    }
                }
                catch (Exception zombie)
                {
                    ModHelper.LogNotExpected(zombie);
                }
            }
            finally
            {
                context.Response.Close();
            }
        }

        public async UniTask StartAsync()
        {
            if (HttpListener.IsListening)
            {
                throw new InvalidOperationException();
            }

            HttpListener.Start();

            while (HttpListener.IsListening)
            {
                var context = await HttpListener.GetContextAsync();
                UniTask.RunOnThreadPool(async () => await ProcessAsync(context, CancellationTokenSource.Token)).Forget();
            }
        }

        public void Stop()
        {
            if (HttpListener.IsListening)
            {
                HttpListener.Stop();
            }
        }

        #endregion

        #region IDisposable

        private bool _isDisposedValue;

        protected virtual void Dispose(bool disposing)
        {
            if (!this._isDisposedValue)
            {
                if (disposing)
                {
                    CancellationTokenSource.Cancel();
                    CancellationTokenSource.Dispose();
                    HttpListener.Close();
                }

                this._isDisposedValue = true;
            }
        }

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        #endregion
    }
}
