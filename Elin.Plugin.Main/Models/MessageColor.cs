namespace Elin.Plugin.Main.Models
{
    public record struct MessageColor
    {
        public MessageColor(float r, float g, float b, float a)
        {
            R = r;
            G = g;
            B = b;
            A = a;
        }

        #region property

        public float R { get; }
        public float G { get; }
        public float B { get; }
        public float A { get; }

        #endregion
    }
}
