using Elin.Plugin.Main.Models.Impl;
using Elin.Plugin.Main.PluginHelpers;
using HarmonyLib;
using System;

namespace Elin.Plugin.Main.Patches
{
    [HarmonyPatch(typeof(Msg))]
    public class MsgPatch
    {
        #region function

        [HarmonyPatch(nameof(Msg.SetColor), new Type[0])]
        [HarmonyPostfix]
        public static void SetColorPostfix()
        {
            // [ELIN:Msg.SetColor]
            // -> currentColor = colors.Default
            MsgImpl.SetColorPostfix(ModHelper.Plugin.LogBuffer, ModHelper.Plugin.LogTimeProvider, Msg.colors.Default);
        }

        [HarmonyPatch(nameof(Msg.SetColor), new[] { typeof(Color) })]
        [HarmonyPostfix]
        public static void SetColorPostfix(Color color)
        {
            MsgImpl.SetColorPostfix(ModHelper.Plugin.LogBuffer, ModHelper.Plugin.LogTimeProvider, color);
        }

        [HarmonyPatch(nameof(Msg.SetColor), new[] { typeof(string) })]
        [HarmonyPostfix]
        public static void SetColorPostfix(string id)
        {
            MsgImpl.SetColorPostfix(ModHelper.Plugin.LogBuffer, ModHelper.Plugin.LogTimeProvider, id);
        }

        [HarmonyPatch(nameof(Msg.SayRaw), new[] { typeof(string) })]
        [HarmonyPostfix]
        public static void SayRawPostfix(string text)
        {
            MsgImpl.SayRawPostfix(ModHelper.Plugin.LogBuffer, ModHelper.Plugin.LogTimeProvider, text);
        }

        [HarmonyPatch(nameof(Msg.NewLine))]
        [HarmonyPostfix]
        public static void NewLinePostfix()
        {
            MsgImpl.NewLinePostfix(ModHelper.Plugin.LogBuffer, ModHelper.Plugin.LogTimeProvider);
        }

        #endregion
    }
}
