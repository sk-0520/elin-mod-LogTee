using Elin.Plugin.Main.Models.Impl;
using Elin.Plugin.Main.PluginHelpers;
using HarmonyLib;

namespace Elin.Plugin.Main.Patches
{
    [HarmonyPatch(typeof(WidgetPopText))]
    public static class WidgetPopTextPatch
    {
        #region function

        [HarmonyPatch(nameof(WidgetPopText._Say), new[] { typeof(string), typeof(FontColor), typeof(Sprite) })]
        [HarmonyPrefix]
        public static void _SayPostfix(Scene __instance, string text, FontColor fontColor, Sprite? sprite)
        {
            WidgetPopTextImpl._SayPostfix(__instance, ModHelper.Plugin.LogBuffer, ModHelper.Plugin.LogTimeProvider, text, fontColor, sprite);
        }

        #endregion
    }
}
