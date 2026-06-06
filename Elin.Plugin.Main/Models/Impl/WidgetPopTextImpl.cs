namespace Elin.Plugin.Main.Models.Impl
{
    public static class WidgetPopTextImpl
    {
        #region WidgetPopText

        public static void _SayPostfix(Scene instance, LogBuffer logBuffer, ILogTimeProvider logTimeProvider, string text, FontColor fontColor, Sprite? sprite)
        {
            var color = SkinManager.Instance.skinDark.Colors.GetTextColor(fontColor);
            var messageColor = ColorUtility.ConvertFromUnityColor(color);
            var messageItem = MessageItem.CreatePopupMessage(text, messageColor);
            var logItem = new LogItem(System.Guid.NewGuid(), logTimeProvider.GetCurrentSystemUtcTimestamp(), logTimeProvider.GetCurrentGameTimestamp(), messageItem);
            logBuffer.Add(logItem);
        }

        #endregion
    }
}
