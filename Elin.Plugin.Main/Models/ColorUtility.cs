namespace Elin.Plugin.Main.Models
{
    public static class ColorUtility
    {
        #region function

        public static MessageColor ConvertFromUnityColor(Color color)
        {
            return new MessageColor(color.r, color.g, color.b, color.a);
        }

        #endregion
    }
}
