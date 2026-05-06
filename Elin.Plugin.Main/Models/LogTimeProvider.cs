using System;

namespace Elin.Plugin.Main.Models
{
    public interface ILogTimeProvider
    {
        #region function

        DateTime GetCurrentSystemUtcTimestamp();
        DateTimeOffset GetCurrentSystemLocalTimestamp();
        GameDateTime GetCurrentGameTimestamp();

        #endregion
    }

    internal class LogTimeProvider : ILogTimeProvider
    {
        #region ITimeProvider

        public DateTime GetCurrentSystemUtcTimestamp()
        {
            return DateTime.UtcNow;
        }

        public DateTimeOffset GetCurrentSystemLocalTimestamp()
        {
            return DateTimeOffset.Now;
        }

        public GameDateTime GetCurrentGameTimestamp()
        {
            if (EMono.scene.mode == Scene.Mode.StartGame || EMono.scene.mode == Scene.Mode.Zone)
            {
                return GameDateTimeUtility.ConvertFromGameDate(EClass.core.game.world.date);
            }

            return GameDateTime.None;
        }

        #endregion
    }
}
