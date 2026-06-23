using System;
using System.Collections.Generic;

namespace FoodOrderAPI.DTOs.Orders
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty; // "Pending", "Preparing", "OutForDelivery", "Delivered"
        public string PaymentMethod { get; set; } = string.Empty; // "COD", "Online"
        public string DeliveryAddress { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    }
}
