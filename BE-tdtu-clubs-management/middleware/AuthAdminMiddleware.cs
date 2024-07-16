using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;

public class AuthAdminMiddleware
{
    private readonly RequestDelegate _next;

    public AuthAdminMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var roleRequiredPaths = new Dictionary<string, int>
        {
            { "/api/admin/all-news", 3 },
            {"/api/admin/cancel-blog", 3},
            {"/api/admin/accept-blog", 3},
        };

        foreach (var path in roleRequiredPaths)
        {
            if (context.Request.Path.StartsWithSegments(path.Key))
            {
                if (!context.Request.Headers.TryGetValue("Authorization", out var token))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("NO_TOKEN");
                    return;
                }

                var userRole = GetUserRoleFromToken(token);

                if (userRole == null || userRole != roleRequiredPaths[path.Key])
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    await context.Response.WriteAsync("INVALID_ROLE");
                    return;
                }
            }
        }
        await _next(context);
    }

    private int? GetUserRoleFromToken(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadToken(token) as JwtSecurityToken;

        if (jwtToken == null)
            return null;

        var roleClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "role")?.Value;
        if (int.TryParse(roleClaim, out int role))
        {
            return role;
        }

        return null;
    }
}
