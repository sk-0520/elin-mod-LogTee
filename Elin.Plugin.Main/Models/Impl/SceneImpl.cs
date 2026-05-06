namespace Elin.Plugin.Main.Models.Impl
{
    public static class SceneImpl
    {
        #region Scene

        public static void InitPrefix(Scene instance, Scene.Mode newMode, LogBuffer logBuffer, ILogTimeProvider logTimeProvider)
        {
            // StartGame 時に Init(Zone) が呼び出されるため、この条件が GameStart のログを出すタイミングとなる
            if (instance.mode == Scene.Mode.StartGame && newMode == Scene.Mode.Zone)
            {
                var messageItem = MessageItem.CreateModMessage(ModMessageKind.Information, ModMessageId.StartGame, null);
                var logItem = new LogItem(System.Guid.NewGuid(), logTimeProvider.GetCurrentSystemUtcTimestamp(), logTimeProvider.GetCurrentGameTimestamp(), messageItem);
                logBuffer.Add(logItem);
            }
        }

        public static void InitPostfix(Scene instance, Scene.Mode newMode, LogBuffer logBuffer, ILogTimeProvider logTimeProvider)
        {
            if (newMode == Scene.Mode.Title)
            {
                var messageItem = MessageItem.CreateModMessage(ModMessageKind.Information, ModMessageId.Title, null);
                var logItem = new LogItem(System.Guid.NewGuid(), logTimeProvider.GetCurrentSystemUtcTimestamp(), logTimeProvider.GetCurrentGameTimestamp(), messageItem);
                logBuffer.Add(logItem);
            }
        }

        #endregion
    }
}
