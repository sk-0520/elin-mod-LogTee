using System;
using System.Net;

namespace Elin.Plugin.Main.Models.Web
{
    public class WebServerException : Exception
    {
        public WebServerException(HttpStatusCode httpStatusCode)
            : this(httpStatusCode, httpStatusCode.ToString())
        { }

        public WebServerException(HttpStatusCode httpStatusCode, string statusDescription)
        {
            HttpStatusCode = httpStatusCode;
            StatusDescription = statusDescription;
        }

        #region property

        public HttpStatusCode HttpStatusCode { get; }
        public string StatusDescription { get; }

        public object? Json { get; set; }

        #endregion
    }
}
