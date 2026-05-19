using System;

namespace Elin.Plugin.Main.Models
{
    // TODO: やっつけ作業, SG 側でコピー処理作った方がいいなぁ
    public static class ObjectUtility
    {
        #region property

        // 名前の通り設定だけコピーできればそれでよし
        public static void CopySetting<T>(T source, T destination)
        {
            // 設定クラスの内部オブジェクトは null にならない
            if (source is null)
            {
                throw new ArgumentNullException(nameof(source));
            }
            if (destination is null)
            {
                throw new ArgumentNullException(nameof(destination));
            }

            var properties = source.GetType().GetProperties();
            foreach (var property in properties)
            {
                if (property.CanRead && property.CanWrite)
                {
                    var sourceValue = property.GetValue(source);

                    if (property.PropertyType.IsClass)
                    {
                        var destinationValue = property.GetValue(destination);
                        CopySetting(sourceValue, destinationValue);
                    }
                    else // 設定クラスに配列なんてものはないのでこれでOK
                    {
                        property.SetValue(destination, sourceValue);
                    }
                }
            }
        }

        #endregion
    }
}
