using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

namespace Elin.Plugin.Main.Models
{
    public static class LogFileUtility
    {
        #region property

        private static Regex FormatFileNameRegex = new Regex(
            @"
            (?<YYYY>
                \$\{YYYY\}
            )
            |
            (?<MM>
                \$\{MM\}
            )
            |
            (?<DD>
                \$\{DD\}
            )
            "
#if DEBUG
            +
            @"
            |
            (?<mm>
                \$\{mm\}
            )
            "
#endif
            ,
            RegexOptions.IgnorePatternWhitespace | RegexOptions.ExplicitCapture
        );

        #endregion

        #region function

        public static string FormatFileName(string fileName, DateTime dateTime)
        {
            return FormatFileNameRegex.Replace(fileName, match =>
            {
                if (match.Groups["YYYY"].Success)
                {
                    return dateTime.ToString("yyyy");
                }
                if (match.Groups["MM"].Success)
                {
                    return dateTime.ToString("MM");
                }
                if (match.Groups["DD"].Success)
                {
                    return dateTime.ToString("dd");
                }
#if DEBUG
                // 分単位でログファイル分けたい理由が分かんないが、デバッグでは必要
                if (match.Groups["mm"].Success)
                {
                    return dateTime.ToString("mm");
                }
#endif
                return match.Value;
            });
        }

        public static LogFilePath BuildLogFilePath(string rawPath, ILogTimeProvider logTimeProvider)
        {
            var directory = Path.GetDirectoryName(rawPath);
            var file = Path.GetFileName(rawPath);
            var dateTime = logTimeProvider.GetCurrentSystemLocalTimestamp();
            file = FormatFileName(file, dateTime.LocalDateTime);
            return new LogFilePath(directory, file);
        }

        public static string[] Tail(string filePath, int lineCount)
        {
            //TODO: 効率は良くないがまずは実装するとこを優先

            using var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            using var reader = new StreamReader(fileStream, Encoding.UTF8);

            var lines = new Queue<string>();

            string line;
            while ((line = reader.ReadLine()) != null)
            {
                lines.Enqueue(line);
                if (lineCount < lines.Count)
                {
                    lines.Dequeue();
                }
            }

            return lines.ToArray();
        }

        #endregion
    }
}
