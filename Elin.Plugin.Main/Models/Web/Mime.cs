using System.Text.RegularExpressions;

namespace Elin.Plugin.Main.Models.Web
{
    public record class Mime
    {
        public Mime(string type, Regex regex, string value)
        {
            Type = type;
            Regex = regex;
            Value = value;
        }

        #region property

        public string Type { get; set; }
        public Regex Regex { get; set; }
        public string Value { get; set; }

        #endregion
    }
}
