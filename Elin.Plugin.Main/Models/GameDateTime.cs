using Newtonsoft.Json;

namespace Elin.Plugin.Main.Models
{
    public record struct GameDateTime
    {
        [JsonConstructor]
        public GameDateTime(int year, int month, int day, int hour, int minute, int second)
        {
            Year = year;
            Month = month;
            Day = day;
            Hour = hour;
            Minute = minute;
            Second = second;
        }

        #region property

        public static GameDateTime None { get; } = new GameDateTime(0, 0, 0, 0, 0, 0);

        public int Year { get; }
        public int Month { get; }
        public int Day { get; }
        public int Hour { get; }
        public int Minute { get; }
        public int Second { get; }

        #endregion
    }
}
