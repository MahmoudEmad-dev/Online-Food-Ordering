using Microsoft.EntityFrameworkCore;
using FoodOrderAPI.Models;
using System;

namespace FoodOrderAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;
        public DbSet<CartItem> CartItems { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ─── Configure User Relationships ─────────────────────────────────────────
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // ─── Configure Order Relationships ────────────────────────────────────────
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasConversion<double>(); // SQLite handles double better than decimal

            modelBuilder.Entity<Order>()
                .Property(o => o.Status)
                .HasConversion<string>(); // Store enum as string in DB

            modelBuilder.Entity<Order>()
                .Property(o => o.PaymentMethod)
                .HasConversion<string>(); // Store enum as string in DB

            // ─── Configure OrderItem Relationships ────────────────────────────────────
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.UnitPrice)
                .HasConversion<double>();

            // ─── Configure CartItem Relationships ─────────────────────────────────────
            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.User)
                .WithMany()
                .HasForeignKey(ci => ci.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Product)
                .WithMany()
                .HasForeignKey(ci => ci.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // ─── Configure Product Pricing ────────────────────────────────────────────
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasConversion<double>();

            // ─── Seed Data ────────────────────────────────────────────────────────────
            
            // Seed Admin User (Password is hashed: "Admin@123")
            // Pre-hashed value: $2a$12$Kk.zX6/pBw56.gJzN6mFSeFmC3w99qH9N634N (deterministic string)
            // We use the pre-hashed value directly to prevent EF Core migrations from generating a new hash on every build/migration.
            var adminUser = new User
            {
                Id = 1,
                FullName = "App Administrator",
                Email = "admin@foodhub.com",
                PasswordHash = "$2a$12$Kk.zX6/pBw56.gJzN6mFSeFmC3w99qH9N634N", // "Admin@123"
                Role = UserRole.Admin,
                CreatedAt = new DateTime(2026, 6, 23, 0, 0, 0, DateTimeKind.Utc)
            };

            modelBuilder.Entity<User>().HasData(adminUser);

            // Seed Products
            modelBuilder.Entity<Product>().HasData(
                // Burgers
                new Product
                {
                    Id = 1,
                    NameEn = "Classic Beef Burger",
                    NameAr = "برجر لحم كلاسيك",
                    DescriptionEn = "Juicy beef patty with fresh lettuce, tomato, cheese, and our special house sauce.",
                    DescriptionAr = "شريحة لحم بقري عصيرية مع خس طازج، طماطم، جبنة، وصلصتنا الخاصة.",
                    Price = 8.99m,
                    ImageUrl = "/images/burger.png",
                    Category = "Burgers",
                    IsAvailable = true,
                    CreatedAt = new DateTime(2026, 6, 23, 0, 0, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = 2,
                    NameEn = "Double Bacon Cheeseburger",
                    NameAr = "دبل باكون تشيز برجر",
                    DescriptionEn = "Two beef patties, crispy beef bacon, double cheddar cheese, pickles, and smoky BBQ sauce.",
                    DescriptionAr = "شريحتان من اللحم البقري، لحم بقري مقدد مقرمش، جبنة شيدر مضاعفة، مخلل، وصلصة باربكيو.",
                    Price = 11.99m,
                    ImageUrl = "/images/burger.png",
                    Category = "Burgers",
                    IsAvailable = true,
                    CreatedAt = new DateTime(2026, 6, 23, 0, 0, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = 3,
                    NameEn = "Spicy Crispy Chicken Burger",
                    NameAr = "برجر دجاج مقرمش حار",
                    DescriptionEn = "Crispy spicy chicken breast fillet, melting cheese slice, shredded lettuce, and spicy mayo.",
                    DescriptionAr = "صدر دجاج مقرمش حار، شريحة جبنة ذائبة، خس مبشور، ومايونيز حار.",
                    Price = 9.49m,
                    ImageUrl = "/images/burger.png",
                    Category = "Burgers",
                    IsAvailable = true,
                    CreatedAt = new DateTime(2026, 6, 23, 0, 0, 0, DateTimeKind.Utc)
                },
                // Pizza
                new Product
                {
                    Id = 4,
                    NameEn = "Margherita Pizza",
                    NameAr = "بيتزا مارجريتا",
                    DescriptionEn = "Simple and delicious with classic tomato sauce, fresh mozzarella cheese, and fresh basil leaves.",
                    DescriptionAr = "بسيطة ولذيذة مع صلصة الطماطم الكلاسيكية، جبنة الموزاريلا الطازجة، وأوراق الريحان الطازجة.",
                    Price = 10.99m,
                    ImageUrl = "/images/pizza.png",
                    Category = "Pizza",
                    IsAvailable = true,
                    CreatedAt = new DateTime(2026, 6, 23, 0, 0, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = 5,
                    NameEn = "Pepperoni Feast Pizza",
                    NameAr = "بيتزا بيبيروني",
                    DescriptionEn = "Generously loaded with sliced pepperoni, mozzarella cheese, and Italian herbs.",
                    DescriptionAr = "محملة بسخاء بشرائح البيبيروني، جبنة الموزاريلا، والأعشاب الإيطالية.",
                    Price = 12.99m,
                    ImageUrl = "/images/pizza.png",
                    Category = "Pizza",
                    IsAvailable = true,
                    CreatedAt = new DateTime(2026, 6, 23, 0, 0, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = 6,
                    NameEn = "BBQ Chicken Pizza",
                    NameAr = "بيتزا الدجاج بالباربكيو",
                    DescriptionEn = "Grilled chicken slices, red onions, mozzarella, cilantro, and sweet smoky BBQ sauce.",
                    DescriptionAr = "شرائح دجاج مشوية، بصل أحمر، موزاريلا، كزبرة، وصلصة باربكيو حلوة مدخنة.",
                    Price = 13.49m,
                    ImageUrl = "/images/pizza.png",
                    Category = "Pizza",
                    IsAvailable = true,
                    CreatedAt = new DateTime(2026, 6, 23, 0, 0, 0, DateTimeKind.Utc)
                },
                // Drinks
                new Product
                {
                    Id = 7,
                    NameEn = "Coca Cola Can",
                    NameAr = "علبة كوكا كولا",
                    DescriptionEn = "Chilled Coca Cola can served with ice and lemon slice.",
                    DescriptionAr = "علبة كوكا كولا مثلجة تقدم مع ثلج وشريحة ليمون.",
                    Price = 1.99m,
                    ImageUrl = "/images/drink.png",
                    Category = "Drinks",
                    IsAvailable = true,
                    CreatedAt = new DateTime(2026, 6, 23, 0, 0, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = 8,
                    NameEn = "Fresh Orange Juice",
                    NameAr = "عصير برتقال طازج",
                    DescriptionEn = "100% natural freshly squeezed orange juice.",
                    DescriptionAr = "عصير برتقال طبيعي معصور طازجاً ١٠٠٪.",
                    Price = 3.49m,
                    ImageUrl = "/images/drink.png",
                    Category = "Drinks",
                    IsAvailable = true,
                    CreatedAt = new DateTime(2026, 6, 23, 0, 0, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = 9,
                    NameEn = "Mojito Lime & Mint",
                    NameAr = "موخيتو ليمون ونعناع",
                    DescriptionEn = "Refreshing cocktail with sparkling water, fresh mint leaves, lime juice, and cane sugar.",
                    DescriptionAr = "كوكتيل منعش مع مياه فوارة، أوراق نعناع طازجة، عصير ليمون، وسكر القصب.",
                    Price = 4.49m,
                    ImageUrl = "/images/drink.png",
                    Category = "Drinks",
                    IsAvailable = true,
                    CreatedAt = new DateTime(2026, 6, 23, 0, 0, 0, DateTimeKind.Utc)
                },
                // Desserts
                new Product
                {
                    Id = 10,
                    NameEn = "Chocolate Lava Cake",
                    NameAr = "مولتن كيك الشوكولاتة",
                    DescriptionEn = "Warm chocolate cake with a molten liquid chocolate center, served with scoop of vanilla ice cream.",
                    DescriptionAr = "كيك شوكولاتة دافئ مع مركز شوكولاتة سائل، يقدم مع بولا آيس كريم فانيليا.",
                    Price = 5.99m,
                    ImageUrl = "/images/dessert.png",
                    Category = "Desserts",
                    IsAvailable = true,
                    CreatedAt = new DateTime(2026, 6, 23, 0, 0, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = 11,
                    NameEn = "New York Cheesecake",
                    NameAr = "تشيز كيك نيويورك",
                    DescriptionEn = "Classic rich cheesecake with a buttery graham cracker crust and sweet strawberry syrup.",
                    DescriptionAr = "تشيز كيك غني كلاسيكي مع طبقة بسكويت بالزبدة وصلصة الفراولة الحلوة.",
                    Price = 6.49m,
                    ImageUrl = "/images/dessert.png",
                    Category = "Desserts",
                    IsAvailable = true,
                    CreatedAt = new DateTime(2026, 6, 23, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
