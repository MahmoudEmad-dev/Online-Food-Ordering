using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FoodOrderAPI.DTOs.Orders;
using FoodOrderAPI.DTOs.Products;
using FoodOrderAPI.Models;
using FoodOrderAPI.Repositories.Interfaces;

namespace FoodOrderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;

        public AdminController(IOrderRepository orderRepository, IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }

        // ─── Order Management ─────────────────────────────────────────────────────

        [HttpGet("orders")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
        {
            var orders = await _orderRepository.GetAllAsync();
            var dtos = orders.Select(MapToOrderDto);
            return Ok(dtos);
        }

        [HttpPut("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            order.Status = dto.Status;
            order.UpdatedAt = DateTime.UtcNow;

            await _orderRepository.SaveChangesAsync();
            return NoContent();
        }

        // ─── Product Management (CRUD) ────────────────────────────────────────────

        [HttpPost("products")]
        public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = new Product
            {
                NameEn = dto.NameEn,
                NameAr = dto.NameAr,
                DescriptionEn = dto.DescriptionEn,
                DescriptionAr = dto.DescriptionAr,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                Category = dto.Category,
                IsAvailable = dto.IsAvailable,
                CreatedAt = DateTime.UtcNow
            };

            await _productRepository.CreateAsync(product);
            await _productRepository.SaveChangesAsync();

            var responseDto = MapToProductDto(product);
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, responseDto);
        }

        [HttpGet("products/{id}")]
        public async Task<ActionResult<ProductDto>> GetProductById(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            return Ok(MapToProductDto(product));
        }

        [HttpPut("products/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] CreateProductDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            product.NameEn = dto.NameEn;
            product.NameAr = dto.NameAr;
            product.DescriptionEn = dto.DescriptionEn;
            product.DescriptionAr = dto.DescriptionAr;
            product.Price = dto.Price;
            product.ImageUrl = dto.ImageUrl;
            product.Category = dto.Category;
            product.IsAvailable = dto.IsAvailable;

            _productRepository.Update(product);
            await _productRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("products/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            _productRepository.Delete(product);
            await _productRepository.SaveChangesAsync();

            return NoContent();
        }

        // ─── Helpers ──────────────────────────────────────────────────────────────

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

        private static ProductDto MapToProductDto(Product p)
        {
            return new ProductDto
            {
                Id = p.Id,
                NameEn = p.NameEn,
                NameAr = p.NameAr,
                DescriptionEn = p.DescriptionEn,
                DescriptionAr = p.DescriptionAr,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                Category = p.Category,
                IsAvailable = p.IsAvailable,
                CreatedAt = p.CreatedAt
            };
        }
    }
}
