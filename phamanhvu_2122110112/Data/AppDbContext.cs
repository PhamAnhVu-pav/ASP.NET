using Microsoft.EntityFrameworkCore;
using phamanhvu_2122110112.Model;

namespace phanamhvu_2122110112.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        // Thêm các DbSet khác nếu cần
        public DbSet<Category> Categories { get; set; }
        public DbSet<Brand> Brands { get; set; }
    }
}