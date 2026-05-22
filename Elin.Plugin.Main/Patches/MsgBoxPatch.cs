using Elin.Plugin.Main.Models.Impl;
using Elin.Plugin.Main.PluginHelpers;
using HarmonyLib;

namespace Elin.Plugin.Main.Patches
{
    // ダメージ表記を取得するための物
    [HarmonyPatch(typeof(MsgBox))]
    public class MsgBoxPatch
    {
        #region function

        [HarmonyPatch(nameof(MsgBox.Append), new[] { typeof(string), typeof(Color) })]
        [HarmonyPriority(Priority.Last)]
        [HarmonyPostfix]
        public static void AppendPostfix(MsgBox __instance, string s, Color col)
        {
            MsgBoxImpl.AppendPostfix(__instance, ModHelper.Plugin.LogBuffer, ModHelper.Plugin.LogTimeProvider, s, col);
        }

        #endregion
    }
}
