using Elin.Plugin.Main.PluginHelpers;
using HarmonyLib;

namespace Elin.Plugin.Main.Samples
{
    [HarmonyPatch(typeof(Scene))]
    internal class ScenePatch
    {
        #region function

        [HarmonyPatch(nameof(Scene.Init), new[] { typeof(Scene.Mode) })]
        [HarmonyPostfix]
        public static void InitPostfix(Scene.Mode newMode)
        {
            switch (newMode)
            {
                case Scene.Mode.Title:
                    ModHelper.WriteDev("DEBUG START!");
                    break;

                case Scene.Mode.StartGame:
                    ModHelper.LogDev(ModHelper.Lang.General.HelloWorld);
                    ModHelper.LogDev(ModHelper.Lang.Formatter.FormatCalculation(a: 999, b: 1, c: 1000));
                    ModHelper.LogDev(ModHelper.GetInformationString());
                    break;

                default:
                    break;
            }
        }

        #endregion
    }

}
