using System.ComponentModel.DataAnnotations;
using FoodOrderAPI.Models;

namespace FoodOrderAPI.DTOs.Orders
{
    public class UpdateOrderStatusDto
    {
        [Required]
        public OrderStatus Status { get; set; }
    }
}
