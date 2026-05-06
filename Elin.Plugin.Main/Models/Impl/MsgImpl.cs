namespace Elin.Plugin.Main.Models.Impl
{
    public static class MsgImpl
    {
        #region Msg

        public static void SetColorPostfix(LogBuffer logBuffer, ILogTimeProvider logTimeProvider, Color color)
        {
            var messageColor = ColorUtility.ConvertFromUnityColor(color);
            var messageItem = MessageItem.CreateColor(messageColor);
            var logItem = new LogItem(System.Guid.NewGuid(), logTimeProvider.GetCurrentSystemUtcTimestamp(), logTimeProvider.GetCurrentGameTimestamp(), messageItem);
            logBuffer.Add(logItem);
        }

        public static void SetColorPostfix(LogBuffer logBuffer, ILogTimeProvider logTimeProvider, string id)
        {
            // Msg.SetColor(string id) の値は Elin 側で動的(とはいっても多分バージョン違い？)に変わる可能性があるため変更後の値である Msg.currentColor を使用する
            // ReloadOnDeath のように Elin 内で完結するものは id を使用すればよいが、本 Mod では外部に保存する必要があるためこのような手法を採用する
            var messageColor = ColorUtility.ConvertFromUnityColor(Msg.currentColor);
            var messageItem = MessageItem.CreateColor(messageColor);
            var logItem = new LogItem(System.Guid.NewGuid(), logTimeProvider.GetCurrentSystemUtcTimestamp(), logTimeProvider.GetCurrentGameTimestamp(), messageItem);
            logBuffer.Add(logItem);
        }

        public static void SayRawPostfix(LogBuffer logBuffer, ILogTimeProvider logTimeProvider, string text)
        {
            var messageItem = MessageItem.CreateMessage(text);
            var logItem = new LogItem(System.Guid.NewGuid(), logTimeProvider.GetCurrentSystemUtcTimestamp(), logTimeProvider.GetCurrentGameTimestamp(), messageItem);
            logBuffer.Add(logItem);
        }

        public static void NewLinePostfix(LogBuffer logBuffer, ILogTimeProvider logTimeProvider)
        {
            var messageItem = MessageItem.CreateNewLine();
            var logItem = new LogItem(System.Guid.NewGuid(), logTimeProvider.GetCurrentSystemUtcTimestamp(), logTimeProvider.GetCurrentGameTimestamp(), messageItem);
            logBuffer.Add(logItem);
        }

        #endregion
    }
}
