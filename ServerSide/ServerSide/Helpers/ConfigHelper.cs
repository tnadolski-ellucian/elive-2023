namespace ServerSide.Helpers
{
	public interface ConfigHelper
	{
        public static IConfiguration Init()
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", optional: false, reloadOnChange: true)
                .Build();
            return config;
        }
    }
}

