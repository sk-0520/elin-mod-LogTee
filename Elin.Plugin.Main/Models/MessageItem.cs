using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Elin.Plugin.Main.Models
{
    public readonly record struct MessageItem
    {
        [JsonConstructor]
        private MessageItem(MessageKind kind, MessageColor color, string? message, ModMessage? mod)
        {
            Kind = kind;
            Color = color;
            Message = message;
            Mod = mod;
        }

        #region property

        [JsonConverter(typeof(StringEnumConverter))]
        public MessageKind Kind { get; }
        public MessageColor Color { get; }
        public string? Message { get; }
        public ModMessage? Mod { get; }

        #endregion

        #region function

        public static MessageItem CreateNewLine()
        {
            return new MessageItem(MessageKind.NewLine, default, default, default);
        }

        public static MessageItem CreateColor(MessageColor color)
        {
            return new MessageItem(MessageKind.Color, color, default, default);
        }

        public static MessageItem CreateMessage(string message)
        {
            return new MessageItem(MessageKind.Message, default, message, default);
        }

        public static MessageItem CreateMessageWithColor(string message, MessageColor color)
        {
            return new MessageItem(MessageKind.MessageWithColor, color, message, default);
        }

        public static MessageItem CreateModMessage(ModMessageKind kind, ModMessageId modMessageId, object? detail)
        {
            return new MessageItem(MessageKind.Mod, default, default, new ModMessage(kind, modMessageId, detail));
        }

        #endregion
    }
}
