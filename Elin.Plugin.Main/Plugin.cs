using Cysharp.Threading.Tasks;
using Elin.Plugin.Main.Models;
using Elin.Plugin.Main.Models.Settings;
using Elin.Plugin.Main.Models.Socket;
using Elin.Plugin.Main.Models.Web;
using Elin.Plugin.Main.PluginHelpers;
using Elin.Plugin.Main.PluginHelpers.Mods;
using System;
using System.IO;

namespace Elin.Plugin.Main
{
    partial class Plugin
    {
        #region property

        internal Setting SettingProxy { get; private set; } = default!;

        private SyncObject SyncObject { get; } = new SyncObject();
        public LogBuffer LogBuffer { get; private set; } = default!;
        public ILogTimeProvider LogTimeProvider { get; private set; } = default!;
        private SocketServer? SocketServer { get; set; }
        private WebServer? WebServer { get; set; }

        #endregion

        #region function

        private bool CanExecuteSocketServer(Setting setting, bool isLogging)
        {
            if (!setting.SocketServer.IsEnabled)
            {
                // 設定そのまま
                return false;
            }

            if (!setting.WebServer.IsEnabled)
            {
                // ソケットサーバーはファイル出力せずにログをWeb側に流すだけの存在なのでWebサーバーが無効なら有効にしない
                if (isLogging)
                {
                    ModHelper.Logger.LogWarning(ModHelper.Lang.Formatter.FormatSocketServerStartSkipped(details: ModHelper.Lang.General.DisabledWebServer));
                }
                return false;
            }

            if (!setting.SocketClient.IsEnabled)
            {
                // Mod 内ソケットクライアントが無効ならサーバーは起動しない。
                // Mod 内ソケットクライアント自体は外部に流す可能性はあるが、
                // Mod 内ソケットサーバーは Mod 内クライアントと通信するためだけなのでクライアントが稼働しないならサーバーも不要。
                if (isLogging)
                {
                    ModHelper.Logger.LogWarning(ModHelper.Lang.Formatter.FormatSocketServerStartSkipped(details: ModHelper.Lang.General.DisabledSocketClient));
                }
                return false;
            }

            if (setting.SocketServer.Port != setting.SocketClient.Port)
            {
                // これも↑の理由と同じ
                // クライアントはどこか別のサーバーと話すのに誰とも通信しない Mod 内サーバーを起動する必要なし
                if (isLogging)
                {
                    ModHelper.Logger.LogWarning(ModHelper.Lang.Formatter.FormatSocketServerStartSkipped(details: ModHelper.Lang.General.DifferentSocketClientPort));
                }
                return false;
            }

            return true;
        }

        /// <summary>
        /// 起動時のプラグイン独自処理。
        /// </summary>
        private void AwakePlugin()
        {
            // 起動時に各種設定値を確定させるためにクローン呼び出し
            // 実行中にポートやらを変えられると反映が面倒
            // ただし設定の保存機能としての窓口として SettingProxy プロパティは使用する
            SettingProxy = Setting.Bind(Config, new Setting());
            var setting = SettingProxy.Clone();
            Setting.Instance = setting;

            LogTimeProvider = new LogTimeProvider();

            if (CanExecuteSocketServer(setting, true))
            {
                SocketServer = new SocketServer(setting.SocketServer.Port, setting.SocketServer.Capacity);
                SocketServer.StartAsync().Forget();
            }

            LogBuffer = new LogBuffer(LogTimeProvider, SyncObject, setting.LogBuffer, setting.LogFile, setting.SocketClient);

            if (setting.WebServer.IsEnabled)
            {
                var webRootPath = ModHelper.Asset.Combine("wwwroot");
                var options = new WebServerOptions
                {
                    WebRoot = new DirectoryInfo(webRootPath),
                    Mimes = new()
                    {
                        new Mime("html", new System.Text.RegularExpressions.Regex(@"\.html$"), "text/html"),
                        new Mime("css", new System.Text.RegularExpressions.Regex(@"\.css$"), "text/css"),
                        new Mime("javascript", new System.Text.RegularExpressions.Regex(@"\.js$"), "application/javascript"),
                        new Mime("text", new System.Text.RegularExpressions.Regex(@"\.txt$"), "text/plain"),
                        new Mime("json", new System.Text.RegularExpressions.Regex(@"\.json$"), "application/json"),
                    }
                };

                WebServer = new WebServer(setting.LogFile, setting.WebServer, SyncObject, LogTimeProvider, SocketServer?.LogItems, options);
                WebServer.StartAsync().Forget();
            }
        }

        /// <summary>
        /// 初期化時のプラグイン独自処理。
        /// </summary>
        /// <remarks>
        /// <para>通常の初期化は基本的に <see cref="AwakePlugin"/> で行う想定。</para>
        /// <para>ModHelp 用に <see cref="Start"/> を生やしたので本メソッドが追加されただけ。</para>
        /// </remarks>
        private void StartPlugin()
        {
            //NOP
            var setting = Setting.Instance;
            if (setting.WebServer.IsEnabled && setting.WebServer.OpenBrowserOnStartup)
            {
                var isEnabledSocket = CanExecuteSocketServer(setting, false) && setting.SocketServer.IsEnabled && setting.SocketClient.IsEnabled;
                var isEnabledLogFile = setting.LogFile.IsEnabled && !string.IsNullOrWhiteSpace(setting.LogFile.FilePath);

                var query = System.Web.HttpUtility.ParseQueryString("");

                if (isEnabledSocket)
                {
                    query.Add("target", "socket");
                }
                else if (isEnabledLogFile)
                {
                    query.Add("target", "file");
                }

                query.Add("lang", Lang.langCode);

                var builder = new UriBuilder
                {
                    Scheme = "http",
                    Host = "localhost",
                    Port = setting.WebServer.Port,
                    Query = query.ToString(),
                };

                var uri = builder.Uri;
                Application.OpenURL(uri.ToString());
            }
        }

        /// <summary>
        /// 終了時のプラグイン独自処理。
        /// </summary>
        private void OnDestroyPlugin()
        {
            LogBuffer?.Dispose();
            SocketServer?.Dispose();
            WebServer?.Dispose();
        }

        #endregion

        #region TemplatePluginBase

        [Obsolete("未完成")]
        protected override void BuildModOptions(ModOptions modOptions)
        {
            //TODO: 思った以上に面倒なので後回し

            //var xmlPath = ModHelper.Asset.Combine("config.xml");
            //ModHelper.WriteDev($"xml path: {xmlPath}");
            //var xml = File.ReadAllText(xmlPath);

            //var guid = ModHelper.GetCurrentPluginId();

            //var controller = modOptions.Register(guid);
            //controller.SetPreBuildXml(xml);
            //controller.ApplyTranslations<Setting>("JP", ModHelper.Lang);
        }

        #endregion

    }
}
