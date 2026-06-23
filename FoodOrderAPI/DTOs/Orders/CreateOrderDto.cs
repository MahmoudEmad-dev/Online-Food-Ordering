using System.ComponentModel.DataAnnotations;
using FoodOrderAPI.Models;

namespace FoodOrderAPI.DTOs.Orders
{
    public class CreateOrderDto
    {
        [Required]
        [StringLength(200, MinimumLength = 10)]
        public string DeliveryAddress { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Notes { get; set; }

        [Required]
        public PaymentMethod PaymentMethod { get; set; }

        // Optional payment info for online orders
        public string? CardNumber { get; set; }
        public string? Expiry { get; set; }
        public string? Cvv { get; set; }
    }
}
