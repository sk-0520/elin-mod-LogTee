using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Elin.Plugin.Main.Models
{
    public record class ModMessage
    {
        [JsonConstructor]
        public ModMessage(ModMessageKind kind, ModMessageId messageId, object? detail)
        {
            Kind = kind;
            MessageId = messageId;
            Detail = detail;
        }

        #region property

        [JsonConverter(typeof(StringEnumConverter))]
        public ModMessageKind Kind { get; }

        [JsonConverter(typeof(ModMessageIdConverter))]
        public ModMessageId MessageId { get; }

        public object? Detail { get; }

        #endregion
    }
}
