using Elin.Plugin.Main.Models;

namespace Elin.Plugin.Main.Test.Models
{
    public class ObjectUtilityTest
    {
        #region function

        private class ChildTestClass
        {
            public string? Value { get; set; }
        }

        private class TestClass
        {
            public int Value { get; set; }
            public ChildTestClass Child { get; set; } = new ChildTestClass();
        }

        [Fact]
        public void CopySettingTest()
        {
            var source = new TestClass
            {
                Value = 42,
                Child = new ChildTestClass { Value = "abc" }
            };
            var destination = new TestClass();
            ObjectUtility.CopySetting(source, destination);

            Assert.Equal(source.Value, destination.Value);
            Assert.NotSame(source.Child, destination.Child);
            Assert.Equal(source.Child.Value, destination.Child.Value);
        }

        #endregion
    }
}
