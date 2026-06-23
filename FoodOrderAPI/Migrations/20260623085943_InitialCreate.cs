using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FoodOrderAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NameEn = table.Column<string>(type: "TEXT", nullable: false),
                    NameAr = table.Column<string>(type: "TEXT", nullable: false),
                    DescriptionEn = table.Column<string>(type: "TEXT", nullable: false),
                    DescriptionAr = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<double>(type: "REAL", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    IsAvailable = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FullName = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Role = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartItems_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalAmount = table.Column<double>(type: "REAL", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    PaymentMethod = table.Column<string>(type: "TEXT", nullable: false),
                    DeliveryAddress = table.Column<string>(type: "TEXT", nullable: false),
                    PhoneNumber = table.Column<string>(type: "TEXT", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    UnitPrice = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Category", "CreatedAt", "DescriptionAr", "DescriptionEn", "ImageUrl", "IsAvailable", "NameAr", "NameEn", "Price" },
                values: new object[,]
                {
                    { 1, "Burgers", new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "شريحة لحم بقري عصيرية مع خس طازج، طماطم، جبنة، وصلصتنا الخاصة.", "Juicy beef patty with fresh lettuce, tomato, cheese, and our special house sauce.", "/images/burger.png", true, "برجر لحم كلاسيك", "Classic Beef Burger", 8.9900000000000002 },
                    { 2, "Burgers", new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "شريحتان من اللحم البقري، لحم بقري مقدد مقرمش، جبنة شيدر مضاعفة، مخلل، وصلصة باربكيو.", "Two beef patties, crispy beef bacon, double cheddar cheese, pickles, and smoky BBQ sauce.", "/images/burger.png", true, "دبل باكون تشيز برجر", "Double Bacon Cheeseburger", 11.99 },
                    { 3, "Burgers", new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "صدر دجاج مقرمش حار، شريحة جبنة ذائبة، خس مبشور، ومايونيز حار.", "Crispy spicy chicken breast fillet, melting cheese slice, shredded lettuce, and spicy mayo.", "/images/burger.png", true, "برجر دجاج مقرمش حار", "Spicy Crispy Chicken Burger", 9.4900000000000002 },
                    { 4, "Pizza", new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "بسيطة ولذيذة مع صلصة الطماطم الكلاسيكية، جبنة الموزاريلا الطازجة، وأوراق الريحان الطازجة.", "Simple and delicious with classic tomato sauce, fresh mozzarella cheese, and fresh basil leaves.", "/images/pizza.png", true, "بيتزا مارجريتا", "Margherita Pizza", 10.99 },
                    { 5, "Pizza", new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "محملة بسخاء بشرائح البيبيروني، جبنة الموزاريلا، والأعشاب الإيطالية.", "Generously loaded with sliced pepperoni, mozzarella cheese, and Italian herbs.", "/images/pizza.png", true, "بيتزا بيبيروني", "Pepperoni Feast Pizza", 12.99 },
                    { 6, "Pizza", new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "شرائح دجاج مشوية، بصل أحمر، موزاريلا، كزبرة، وصلصة باربكيو حلوة مدخنة.", "Grilled chicken slices, red onions, mozzarella, cilantro, and sweet smoky BBQ sauce.", "/images/pizza.png", true, "بيتزا الدجاج بالباربكيو", "BBQ Chicken Pizza", 13.49 },
                    { 7, "Drinks", new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "علبة كوكا كولا مثلجة تقدم مع ثلج وشريحة ليمون.", "Chilled Coca Cola can served with ice and lemon slice.", "/images/drink.png", true, "علبة كوكا كولا", "Coca Cola Can", 1.99 },
                    { 8, "Drinks", new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "عصير برتقال طبيعي معصور طازجاً ١٠٠٪.", "100% natural freshly squeezed orange juice.", "/images/drink.png", true, "عصير برتقال طازج", "Fresh Orange Juice", 3.4900000000000002 },
                    { 9, "Drinks", new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "كوكتيل منعش مع مياه فوارة، أوراق نعناع طازجة، عصير ليمون، وسكر القصب.", "Refreshing cocktail with sparkling water, fresh mint leaves, lime juice, and cane sugar.", "/images/drink.png", true, "موخيتو ليمون ونعناع", "Mojito Lime & Mint", 4.4900000000000002 },
                    { 10, "Desserts", new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "كيك شوكولاتة دافئ مع مركز شوكولاتة سائل، يقدم مع بولا آيس كريم فانيليا.", "Warm chocolate cake with a molten liquid chocolate center, served with scoop of vanilla ice cream.", "/images/dessert.png", true, "مولتن كيك الشوكولاتة", "Chocolate Lava Cake", 5.9900000000000002 },
                    { 11, "Desserts", new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "تشيز كيك غني كلاسيكي مع طبقة بسكويت بالزبدة وصلصة الفراولة الحلوة.", "Classic rich cheesecake with a buttery graham cracker crust and sweet strawberry syrup.", "/images/dessert.png", true, "تشيز كيك نيويورك", "New York Cheesecake", 6.4900000000000002 }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "PasswordHash", "Role" },
                values: new object[] { 1, new DateTime(2026, 6, 23, 0, 0, 0, 0, DateTimeKind.Utc), "admin@foodhub.com", "App Administrator", "$2a$12$Kk.zX6/pBw56.gJzN6mFSeFmC3w99qH9N634N", 1 });

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_ProductId",
                table: "CartItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_UserId",
                table: "CartItems",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartItems");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
