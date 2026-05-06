namespace Elin.Plugin.Main.Models.Impl
{
    public static class MsgBoxImpl
    {
        #region MsgBox

        public static void AppendPostfix(MsgBox instance, LogBuffer logBuffer, ILogTimeProvider logTimeProvider, string s, Color color)
        {
            var messageColor = ColorUtility.ConvertFromUnityColor(color);
            var messageItem = MessageItem.CreateMessageWithColor(s, messageColor);
            var logItem = new LogItem(System.Guid.NewGuid(), logTimeProvider.GetCurrentSystemUtcTimestamp(), logTimeProvider.GetCurrentGameTimestamp(), messageItem);
            logBuffer.Add(logItem);
        }

        #endregion
    }
}
