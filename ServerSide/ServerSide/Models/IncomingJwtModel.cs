using System;
namespace ServerSide.Models
{
	public class IncomingJwtModel
	{
        public class Tenant
        {
            public string Id { get; set; } = "";
        }

        public class User
        {
            //Ethos guid
            public string Id { get; set; } = "";

            //Erp ID
            public string erpId { get; set; } = "";

            //Assigned Roles
            public List<string> roles { get; set; } = new();
        }

        public class Card
        {
            public string Id { get; set; } = "";
            public string ExtensionId { get; set; } = "";
            public string CardServerConfigurationApiUrl { get; set; } = "";
        }
    }
}

