using Newtonsoft.Json;
using System;

namespace Elin.Plugin.Main.Models
{
    public record class LogItem
    {
        [JsonConstructor]
        public LogItem(Guid uuid, DateTime logTimestamp, GameDateTime gameTimestamp, MessageItem message)
        {
            Uuid = uuid;
            LogTimestamp = logTimestamp;
            GameTimestamp = gameTimestamp;
            Message = message;
        }

        #region property
        public Guid Uuid { get; }
        public DateTime LogTimestamp { get; }
        public GameDateTime GameTimestamp { get; }
        public MessageItem Message { get; }

        #endregion
    }
}
