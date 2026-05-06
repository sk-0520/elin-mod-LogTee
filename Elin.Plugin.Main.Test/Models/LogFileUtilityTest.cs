using Elin.Plugin.Main.Models;
using System;

namespace Elin.Plugin.Main.Test.Models
{
    public class LogFileUtilityTest
    {
        #region function

        public static TheoryData<string, string, DateTime> FormatFileNameData => new()
        {
            { "log.txt", "log.txt", new DateTime(2024, 6, 1) },
            { "log_2024.txt", "log_${YYYY}.txt", new DateTime(2024, 6, 1) },
            { "log_06.txt", "log_${MM}.txt", new DateTime(2024, 6, 1) },
            { "log_01.txt", "log_${DD}.txt", new DateTime(2024, 6, 1) },
            { "log_2024_06.txt", "log_${YYYY}_${MM}.txt", new DateTime(2024, 6, 1) },
            { "log_2024_06_01.txt", "log_${YYYY}_${MM}_${DD}.txt", new DateTime(2024, 6, 1) },
            { "log_2024_12_31.txt", "log_${YYYY}_${MM}_${DD}.txt", new DateTime(2024, 12, 31) },
            { "log_2024_01_01.txt", "log_${YYYY}_${MM}_${DD}.txt", new DateTime(2024, 1, 1) },
        };

        [Theory]
        [MemberData(nameof(FormatFileNameData))]
        public void FormatFileNameTest(string expected, string logFileName, DateTime dateTime)
        {
            var actual = LogFileUtility.FormatFileName(logFileName, dateTime);

            Assert.Equal(expected, actual);
        }

        #endregion
    }
}
