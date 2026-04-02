using bp_api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace bp_api.Data
{
    public class AppDbContext : IdentityDbContext<User, Role, string>
    {
        private readonly IConfiguration _configuration;

        public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<Tips> Tips { get; set; }
        public DbSet<OpeningHours> OpeningHours { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<OpeningHours>()
                .HasKey(o => new { o.Day, o.BusinessId });

           modelBuilder.Entity<Tips>()
                .HasOne(t => t.Product)        
                .WithMany(p => p.Tips)        
                .HasForeignKey(t => t.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            var adminRoleId = "11111111-1111-1111-1111-111111111111";
            var businessRoleId = "22222222-2222-2222-2222-222222222222";
            var userRoleId = "33333333-3333-3333-3333-333333333333";
            var adminUserId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = adminRoleId, Name = "Admin", NormalizedName = "ADMIN" },
                new Role { Id = businessRoleId, Name = "Business", NormalizedName = "BUSINESS" },
                new Role { Id = userRoleId, Name = "User", NormalizedName = "USER" }
            );

            var adminUser = new User
            {
                Id = adminUserId,
                UserName = "admin@localhost",
                NormalizedUserName = "ADMIN@LOCALHOST",
                Email = "admin@localhost",
                NormalizedEmail = "ADMIN@LOCALHOST",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var passwordHasher = new PasswordHasher<User>();
            var plainPassword = _configuration["AdminSettings:Password"] ?? "DefaultAdmin123!";
            adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, plainPassword);

            modelBuilder.Entity<User>().HasData(adminUser);

            modelBuilder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>
                {
                    UserId = adminUserId,
                    RoleId = adminRoleId
                }
            );
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warnings =>
                warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
        }
    }
}