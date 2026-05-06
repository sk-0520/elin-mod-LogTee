using Newtonsoft.Json;
using System;
using System.Text;

namespace Elin.Plugin.Main.Models
{
    public class ModMessageIdConverter : JsonConverter
    {
        #region define

        private const string Prefix = "mod.message.id.";

        #endregion

        #region JsonConverter

        public override bool CanConvert(Type objectType)
        {
            if (!objectType.IsEnum)
            {
                return false;
            }

            return typeof(ModMessageId) == objectType;
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.String)
            {
                var value = reader.Value.ToString();
                if (value.StartsWith(Prefix))
                {
                    value = value.Substring(Prefix.Length);
                }
                else
                {
                    throw new JsonReaderException($"Expected string to start with {Prefix}");
                }

                // てけとー
                value = value.Replace("-", "");
                return Enum.Parse(typeof(ModMessageId), value, ignoreCase: true);
            }

            throw new JsonReaderException($"Unexpected token {reader.TokenType}");
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var strEnum = value.ToString();
            var buffer = new StringBuilder(Prefix.Length + strEnum.Length * 2);
            buffer.Append(Prefix);

            for (var i = 0; i < strEnum.Length; i++)
            {
                var c = strEnum[i];

                if (char.IsUpper(c))
                {
                    if (i != 0)
                    {
                        buffer.Append('-');
                    }
                    buffer.Append(char.ToLower(c));
                }
                else
                {
                    buffer.Append(c);
                }
            }

            var jsonValue = buffer.ToString();

            writer.WriteValue(jsonValue);
        }

        #endregion
    }
}
