using Elin.Plugin.Main.Models.Impl;
using Elin.Plugin.Main.PluginHelpers;
using HarmonyLib;

namespace Elin.Plugin.Main.Patches
{
    [HarmonyPatch(typeof(Scene))]
    public static class ScenePatch
    {
        #region Scene

        [HarmonyPatch(nameof(Scene.Init), new[] { typeof(Scene.Mode) })]
        [HarmonyPrefix]
        public static void InitPrefix(Scene __instance, Scene.Mode newMode)
        {
            SceneImpl.InitPrefix(__instance, newMode, ModHelper.Plugin.LogBuffer, ModHelper.Plugin.LogTimeProvider);
        }

        [HarmonyPatch(nameof(Scene.Init), new[] { typeof(Scene.Mode) })]
        [HarmonyPostfix]
        public static void InitPostfix(Scene __instance, Scene.Mode newMode)
        {
            SceneImpl.InitPostfix(__instance, newMode, ModHelper.Plugin.LogBuffer, ModHelper.Plugin.LogTimeProvider);
        }



        #endregion
    }
}
