using Microsoft.EntityFrameworkCore;
using BE_tdtu_clubs_management.Models;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BE_tdtu_clubs_management.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Account> Account { get; set; }
        public DbSet<OTP> OTPs { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<Mails> Mails { get; set; }

        public DbSet<Clubs> Clubs { get; set; }
        public DbSet<Club_Members> Club_Members { get; set; }
        public DbSet<Events> Events { get; set; }
        public DbSet<Event_Task> Tasks { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Schedules> Schedules { get; set; }
        public DbSet<Attendances> Attendances { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Account>().HasKey(a => a.student_Id);
            modelBuilder.Entity<OTP>().HasKey(a => a.Code);
            modelBuilder.Entity<News>()
                .Property(n => n.HashTagJson)
                .HasColumnName("HashTag")
                .HasColumnType("nvarchar(max)"); // Use nvarchar(max) instead of json
            modelBuilder.Entity<Clubs>().HasKey(a => a.Id);
            modelBuilder.Entity<Club_Members>().HasKey(a => a.Id);
            modelBuilder.Entity<Events>().HasKey(a => a.Id);
            modelBuilder.Entity<Event_Task>().HasKey(a => a.Id);
            modelBuilder.Entity<Report>().HasKey(a => a.Id);
            modelBuilder.Entity<Schedules>().HasKey(a => a.Id);
            modelBuilder.Entity<Attendances>().HasKey(a => a.Id);
        }
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<News>())
            {
                if (entry.State == EntityState.Added || entry.State == EntityState.Modified)
                {
                    entry.Entity.GenerateSlug();
                }
            }
            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
