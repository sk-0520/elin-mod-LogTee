using Elin.Plugin.Main.Samples;
using HarmonyLib;
using System;
using System.Diagnostics;

namespace Elin.Plugin.Main
{
    partial class Plugin
    {
        #region function

        /// <summary>
        /// 起動時のプラグイン独自処理。
        /// </summary>
        private void AwakePlugin()
        {
            // サンプル用パッチ処理のため削除してください
            PatchSample();
            //NOP
        }

        /// <summary>
        /// 終了時のプラグイン独自処理。
        /// </summary>
        private void OnDestroyPlugin()
        {
            //NOP
        }

        #endregion

        #region sample

        /// <summary>
        /// サンプル用パッチ処理です。
        /// </summary>
        /// <remarks>不要なので削除してください。</remarks>
        [Conditional("DEBUG")]
        void PatchSample()
        {
            // ネストクラスのフル名（例: Namespace.SourceElement+Row）
            var nestedType = AccessTools.TypeByName($"{typeof(SourceElement).FullName}+{nameof(SourceElement.Row)}");

            // オリジナルメソッド（シグネチャを正確に指定）
            var original = AccessTools.Method(nestedType, nameof(SourceElement.Row.GetText), new Type[] { typeof(string), typeof(bool) });

            // Prefix の MethodInfo を取得（このクラス内に static メソッドを用意）
            var prefix = AccessTools.Method(typeof(SourceElementRowPatch), nameof(SourceElementRowPatch.GetTextPrefix));

            Harmony.Patch(original, prefix: new HarmonyMethod(prefix));
        }

        #endregion
    }
}
