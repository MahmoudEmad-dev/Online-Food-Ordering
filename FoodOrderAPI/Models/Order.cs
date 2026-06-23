using System;
using System.Collections.Generic;

namespace FoodOrderAPI.Models
{
    public enum OrderStatus
    {
        Pending,
        Preparing,
        OutForDelivery,
        Delivered
    }

    public enum PaymentMethod
    {
        COD,
        Online
    }

    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.COD;
        public string DeliveryAddress { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
