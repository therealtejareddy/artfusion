using Artfusion.Models;
using ArtFusion.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtFusion.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FollowsModel>().HasKey(table => new
            {
                table.FollowingUserId,
                table.FollowedUserId
            });

            modelBuilder.Entity<LikesModel>().HasKey(table => new
            {
                table.ProductId,
                table.UserId
            });
            modelBuilder.Entity<ShoppingCartItemModel>().HasAlternateKey(table => new
            {
                table.ProductId,
                table.UserId
            });
            modelBuilder.Entity<ProductMetadataModel>().HasKey(table => new
            {
                table.ProductId,
                table.MetaDataKey
            });

        }

        public DbSet<CategoryModel> Categories { get; set; }
        public DbSet<FollowsModel> Follows { get; set; }
        public DbSet<LikesModel> Likes { get; set; }
        public DbSet<OrderDetailsModel> OrderDetails { get; set; }
        public DbSet<PaymentsModel> Payments { get; set; }
        public DbSet<ProductsModel> Products { get; set; }
        public DbSet<UserAddressModel> UserAddress { get; set; }
        public DbSet<UserModel> Users { get; set; }
        public DbSet<ShoppingCartItemModel> ShoppingCartItem { get; set; }
        public DbSet<ProductMetadataModel> ProductMetadata { get; set; }

    }
}
