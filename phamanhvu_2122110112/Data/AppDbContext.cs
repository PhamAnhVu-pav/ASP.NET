using Microsoft.EntityFrameworkCore;
using phamanhvu_2122110112.Model;

namespace phamanhvu_2122110112.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Product> Products { get; set; }
    }
}
