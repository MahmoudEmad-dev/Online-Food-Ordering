using System.ComponentModel.DataAnnotations;

namespace FoodOrderAPI.DTOs.Products
{
    public class CreateProductDto
    {
        [Required]
        [StringLength(100)]
        public string NameEn { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string NameAr { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string DescriptionEn { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string DescriptionAr { get; set; } = string.Empty;

        [Required]
        [Range(0.01, 10000.0)]
        public decimal Price { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        public bool IsAvailable { get; set; } = true;
    }
}
