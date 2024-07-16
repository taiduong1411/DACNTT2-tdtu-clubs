using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using BE_tdtu_clubs_management.Data;
using BE_tdtu_clubs_management.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Http;
using BE_tdtu_clubs_management.Hubs;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSignalR().AddNewtonsoftJsonProtocol();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Thêm dịch vụ CORS
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("http://127.0.0.1:5173",
//         builder =>
//         {
//             builder.AllowAnyOrigin()
//                    .AllowAnyHeader()
//                    .AllowAnyMethod();
//         });
// });
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        builder =>
        {
            builder.WithOrigins("http://127.0.0.1:5173") // Địa chỉ client của bạn
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials(); // Cho phép gửi cookie
        });
});


// Email
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddTransient<IEmailService, EmailService>();

// Hosted service
builder.Services.AddHostedService<OtpCleanupService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<CloudinaryService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configure the middleware pipeline
app.UseRouting();
app.UseCors("AllowSpecificOrigins");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Custom middleware
app.UseMiddleware<AuthManagementMiddleware>();
app.UseMiddleware<AuthAdminMiddleware>();

app.UseStaticFiles();

app.MapControllers(); // Đăng ký các tuyến đường cho Controller
app.MapHub<NotificationHub>("/notificationHub");

app.Run();
