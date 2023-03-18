using System;
namespace ServerSide.Helpers
{
    // this list in a client's environment would only be test and proper
	public class ExpEnvList
	{
        public static List<string> GetExperienceEnvs()
        {
            List<string> experienceEnvs = new List<string>();
            experienceEnvs.AddRange(new List<string>
            {
                "https://experience-test.elluciancloud.com",
                "https://experience.elluciancloud.com",
                "https://eee-dashboard-dev.experience-dev-dev.elluciancloud.com",
                "http://localhost"
            });

            return experienceEnvs;
        }
    }
}

