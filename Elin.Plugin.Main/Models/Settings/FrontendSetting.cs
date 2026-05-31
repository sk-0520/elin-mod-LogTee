using Elin.Plugin.Generated;

namespace Elin.Plugin.Main.Models.Settings
{
    public interface IReadOnlyFrontendSetting
    {
        #region property

        string CssFontFamily { get; }
        string CssFontSize { get; }

        int ElementLimit { get; }

        string HighlightV2 { get; }

        #endregion
    }

    public partial class FrontendSetting : IReadOnlyFrontendSetting
    {
        #region IReadOnlyFrontendSetting

        public virtual string CssFontFamily { get; set; } = string.Empty;
        public virtual string CssFontSize { get; set; } = string.Empty;
        public virtual int ElementLimit { get; set; }

        /// <summary>
        /// ハイライト設定。
        /// </summary>
        /// <remarks>
        /// <para>この設定値はプラグイン側では使用しない。</para>
        /// <para>すべてフロントエンド側で処理される。</para>
        /// <para>フロントエンドで base64 デコードした後に JSON として解釈され、フロントから保存APIを実行する際にも base64 デコードする。</para>
        /// <para>ユーザーに直接編集させることを禁止することが目的じゃなくて、JSON内の \ が BepInEx で上手いこと動かないっぽいのでその回避が目的。</para>
        /// </remarks>
        [GeneratePluginConfigDescription(nameof(PluginLocalizationConfig.FrontendSettingHighlightV2), AllLanguage = true)]
        public virtual string HighlightV2 { get; set; } = string.Empty;

        #endregion
    }
}
