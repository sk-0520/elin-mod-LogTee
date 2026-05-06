using Elin.Plugin.Main.Models;
using Newtonsoft.Json;
using System;

namespace Elin.Plugin.Main.Test.Models
{
    public class ModMessageIdConverterTest
    {
        #region function

        [Theory]
        [InlineData(/* lang=json,strict */"\"mod.message.id.unknown-error\"", ModMessageId.UnknownError)]
        [InlineData(/* lang=json,strict */"\"mod.message.id.exit\"", ModMessageId.Exit)]
        public void ConvertWriteTest(string expected, ModMessageId value)
        {
            var actual = JsonConvert.SerializeObject(value, converters: new[] { new ModMessageIdConverter() });
            Assert.Equal(expected, actual);
        }

        [Theory]
        [InlineData(ModMessageId.UnknownError, /* lang=json,strict */"\"mod.message.id.unknown-error\"")]
        [InlineData(ModMessageId.Exit, /* lang=json,strict */"\"mod.message.id.exit\"")]
        public void ConvertReadTest(ModMessageId expected, string value)
        {
            var actual = JsonConvert.DeserializeObject<ModMessageId>(value, new ModMessageIdConverter());
            Assert.Equal(expected, actual);
        }

        private sealed record class TestClass
        {
            [JsonConverter(typeof(ModMessageIdConverter))]
            public ModMessageId Id { get; set; }
        }

        [Fact]
        public void SerializeDeserializeTest()
        {
            var input = new TestClass { Id = ModMessageId.StreamClientError };
            var output = JsonConvert.SerializeObject(input);
            var actual = JsonConvert.DeserializeObject<TestClass>(output);
            Assert.Equal(input, actual);
        }

        // テストっていうか変換済みの値を ts 側に持っていくためだけの簡易処理
        // なのでテストとしてはなんの意味もない(処理が動いてるかどうかは ConvertWriteTest だし)
        [Fact]
        public void NoTest()
        {
            var values = Enum.GetValues(typeof(ModMessageId));
            var actual = JsonConvert.SerializeObject(values, converters: new[] { new ModMessageIdConverter() });
            Assert.True(actual != null);
        }

        #endregion
    }
}
