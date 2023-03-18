using System;
using Microsoft.AspNetCore.Hosting;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Primitives;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using ServerSide.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

namespace ServerSide.Helpers
{
    public static class Validation
	{
        private static IConfiguration _config;
        private static bool ValidateExperienceJwt(string token, HttpContext ctx)
        {
            try
            {
                _config = ConfigHelper.Init();
                var secret = _config.GetValue<string>("AppSettings:SHARED_SECRET");
                var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));
                var handler = new JwtSecurityTokenHandler();

                handler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidAlgorithms = new[] { "HS256" },
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateLifetime = false,
                    ValidateIssuer = true,
                    ValidIssuers = new List<string>() { "Ellucian Experience Dashboard" },
                    ValidateAudience = false
                }, out SecurityToken validatedToken);

                var jwtSecurity = handler.ReadToken(token) as JwtSecurityToken;
                var claims = jwtSecurity.Claims.ToDictionary(c => c.Type);

                var jsonConvert = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

                ctx.Items.Add("tenant", JsonSerializer.Deserialize<IncomingJwtModel.Tenant>(claims["tenant"].Value, jsonConvert));
                ctx.Items.Add("user", JsonSerializer.Deserialize<IncomingJwtModel.User>(claims["user"].Value, jsonConvert));
                ctx.Items.Add("card", JsonSerializer.Deserialize<IncomingJwtModel.Card>(claims["card"].Value, jsonConvert));

                return true;
            }
            catch (Exception e)
            {
                Console.Write(e);
                throw new Exception(e.Message);
            }
        }

        public static IApplicationBuilder ExperienceHandler(IApplicationBuilder app)
        {
            app.Use(async (ctx, next) =>
            {
                if (ctx.Request.Headers.TryGetValue("Authorization", out StringValues authHeader))
                {
                    var token = authHeader[0]?.Split(' ')?[1];
                    if (token != null)
                    {
                        var valid = ValidateExperienceJwt(token, ctx);
                        if (valid)
                        {
                            await next();
                            return;
                        }
                    }
                }
                ctx.Response.StatusCode = 403;
            });
            return app;
        }
    }
}

