using Microsoft.AspNetCore.Mvc;
using ServerSide.Helpers;

namespace ServerSide.Controllers;

public class HomeController : ControllerBase
{
    private IConfiguration _config;
    public ActionResult Index()
    {
        _config = ConfigHelper.Init();
        return Redirect(_config.GetValue<string>("AppSettings:EXPERIENCE_HOME"));
    }
}

