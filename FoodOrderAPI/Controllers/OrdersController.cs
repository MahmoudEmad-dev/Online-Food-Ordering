using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FoodOrderAPI.DTOs.Orders;
using FoodOrderAPI.DTOs.Products;
using FoodOrderAPI.Models;
using FoodOrderAPI.Repositories.Interfaces;
using FoodOrderAPI.Services.Interfaces;

namespace FoodOrderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IPaymentService _paymentService;

        public OrdersController(
            IOrderRepository orderRepository,
            ICartRepository cartRepository,
            IPaymentService paymentService)
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _paymentService = paymentService;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("Invalid or missing user ID claim.");
            }
            return userId;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] CreateOrderDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();

            // Fetch cart items
            var cartItems = (await _cartRepository.GetByUserIdAsync(userId)).ToList();
            if (!cartItems.Any())
            {
                return BadRequest(new { message = "Cannot place an order with an empty cart." });
            }

            // Calculate total price
            decimal totalAmount = cartItems.Sum(item => item.Product!.Price * item.Quantity);

            // Handle online payment processing
            if (dto.PaymentMethod == PaymentMethod.Online)
            {
                if (string.IsNullOrWhiteSpace(dto.CardNumber) || 
                    string.IsNullOrWhiteSpace(dto.Expiry) || 
                    string.IsNullOrWhiteSpace(dto.Cvv))
                {
                    return BadRequest(new { message = "Credit card payment details are required for online orders." });
                }

                var paymentApproved = await _paymentService.ProcessPaymentAsync(
                    totalAmount, 
                    dto.CardNumber, 
                    dto.Expiry, 
                    dto.Cvv
                );

                if (!paymentApproved)
                {
                    return BadRequest(new { message = "Online payment processing failed. Please check card details." });
                }
            }

            // Create Order
            var order = new Order
            {
                UserId = userId,
                TotalAmount = totalAmount,
                Status = OrderStatus.Pending,
                PaymentMethod = dto.PaymentMethod,
                DeliveryAddress = dto.DeliveryAddress,
                PhoneNumber = dto.PhoneNumber,
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Map cart items to order items
            foreach (var item in cartItems)
            {
                order.OrderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Product!.Price
                });
            }

            await _orderRepository.CreateAsync(order);
            await _orderRepository.SaveChangesAsync();

            // Clear Cart
            await _cartRepository.ClearCartAsync(userId);
            await _cartRepository.SaveChangesAsync();

            // Map to response DTO
            var orderDetails = await _orderRepository.GetByIdAsync(order.Id);
            var responseDto = MapToOrderDto(orderDetails!);

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, responseDto);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var userId = GetCurrentUserId();
            var orders = await _orderRepository.GetByUserIdAsync(userId);
            
            var dtos = orders.Select(MapToOrderDto);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(int id)
        {
            var userId = GetCurrentUserId();
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            // Authorization check: User must own the order or be an Admin
            if (order.UserId != userId && userRole != UserRole.Admin.ToString())
            {
                return Forbid();
            }

            return Ok(MapToOrderDto(order));
        }

        private static OrderDto MapToOrderDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                CustomerName = order.User?.FullName ?? string.Empty,
                TotalAmount = order.TotalAmount,
                Status = order.Status.ToString(),
                PaymentMethod = order.PaymentMethod.ToString(),
                DeliveryAddress = order.DeliveryAddress,
                PhoneNumber = order.PhoneNumber,
                Notes = order.Notes,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                Items = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    ProductNameEn = oi.Product?.NameEn ?? string.Empty,
                    ProductNameAr = oi.Product?.NameAr ?? string.Empty,
                    ImageUrl = oi.Product?.ImageUrl ?? string.Empty
                }).ToList()
            };
        }
    }
}
