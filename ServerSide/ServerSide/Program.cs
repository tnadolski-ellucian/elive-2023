using ServerSide.Helpers;
using ServerSide.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddCors(opts =>
    opts.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(String.Join(",", ExpEnvList.GetExperienceEnvs()))
            .AllowCredentials()
            .WithHeaders("Authorization", "Content-Type")
            .SetIsOriginAllowed(origin => true)
            .AllowAnyMethod();
    }));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var eliveDb = builder.Configuration.GetConnectionString("EliveDb");
builder.Services.AddDbContext<EliveDbContext>(x => x.UseNpgsql(eliveDb));

var app = builder.Build();

app.UseRouting();
app.UseCors();

app.UseWhen(
    ctx => ctx.Request.Path.StartsWithSegments("/api"),
    appBuilder => Validation.ExperienceHandler(appBuilder)
);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}"
);
app.MapControllerRoute(
    name: "api",
    pattern: "api/{controller}/{action}/{id?}"
);

app.UseAuthorization();
app.MapControllers();
app.Run();