namespace Elin.Plugin.Main.Models
{
    public static class GameDateTimeUtility
    {
        #region function

        public static GameDateTime ConvertFromGameDate(Date date)
        {
            return new GameDateTime(date.year, date.month, date.day, date.hour, date.min, date.sec);
        }

        #endregion
    }
}
