using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BE_tdtu_clubs_management.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace BE_tdtu_clubs_management.Services
{
    public class OtpCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<OtpCleanupService> _logger;

        public OtpCleanupService(IServiceProvider serviceProvider, ILogger<OtpCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CleanupExpiredOtpsAsync();
                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken); // Chạy mỗi 10 giây
            }
        }

        private async Task CleanupExpiredOtpsAsync()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var expiredOtps = await dbContext.OTPs
                    .Where(otp => otp.ExpiryTime <= DateTime.UtcNow)
                    .ToListAsync();

                if (expiredOtps.Any())
                {
                    dbContext.OTPs.RemoveRange(expiredOtps);
                    await dbContext.SaveChangesAsync();
                    _logger.LogInformation("Expired OTPs cleaned up");
                }
            }
        }
    }
}
