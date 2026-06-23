using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FoodOrderAPI.DTOs.Cart;
using FoodOrderAPI.DTOs.Products;
using FoodOrderAPI.Models;
using FoodOrderAPI.Repositories.Interfaces;

namespace FoodOrderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;

        public CartController(ICartRepository cartRepository, IProductRepository productRepository)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCart()
        {
            var userId = GetCurrentUserId();
            var items = await _cartRepository.GetByUserIdAsync(userId);

            var dtos = items.Select(item => new CartItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Product = new ProductDto
                {
                    Id = item.Product!.Id,
                    NameEn = item.Product.NameEn,
                    NameAr = item.Product.NameAr,
                    DescriptionEn = item.Product.DescriptionEn,
                    DescriptionAr = item.Product.DescriptionAr,
                    Price = item.Product.Price,
                    ImageUrl = item.Product.ImageUrl,
                    Category = item.Product.Category,
                    IsAvailable = item.Product.IsAvailable,
                    CreatedAt = item.Product.CreatedAt
                }
            });

            return Ok(dtos);
        }

        [HttpPost]
        public async Task<ActionResult<CartItemDto>> AddToCart([FromBody] AddToCartDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();

            // Verify product exists
            var product = await _productRepository.GetByIdAsync(dto.ProductId);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            if (!product.IsAvailable)
            {
                return BadRequest(new { message = "Product is currently not available." });
            }

            // Check if product is already in user's cart
            var existingItem = await _cartRepository.GetItemAsync(userId, dto.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
                await _cartRepository.SaveChangesAsync();
                return Ok(new CartItemDto
                {
                    Id = existingItem.Id,
                    ProductId = existingItem.ProductId,
                    Quantity = existingItem.Quantity,
                    Product = new ProductDto
                    {
                        Id = product.Id,
                        NameEn = product.NameEn,
                        NameAr = product.NameAr,
                        DescriptionEn = product.DescriptionEn,
                        DescriptionAr = product.DescriptionAr,
                        Price = product.Price,
                        ImageUrl = product.ImageUrl,
                        Category = product.Category,
                        IsAvailable = product.IsAvailable,
                        CreatedAt = product.CreatedAt
                    }
                });
            }

            var cartItem = new CartItem
            {
                UserId = userId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity
            };

            await _cartRepository.AddItemAsync(cartItem);
            await _cartRepository.SaveChangesAsync();

            // Refresh item to include product details
            var savedItem = await _cartRepository.GetItemAsync(userId, dto.ProductId);

            return CreatedAtAction(nameof(GetCart), null, new CartItemDto
            {
                Id = savedItem!.Id,
                ProductId = savedItem.ProductId,
                Quantity = savedItem.Quantity,
                Product = new ProductDto
                {
                    Id = product.Id,
                    NameEn = product.NameEn,
                    NameAr = product.NameAr,
                    DescriptionEn = product.DescriptionEn,
                    DescriptionAr = product.DescriptionAr,
                    Price = product.Price,
                    ImageUrl = product.ImageUrl,
                    Category = product.Category,
                    IsAvailable = product.IsAvailable,
                    CreatedAt = product.CreatedAt
                }
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuantity(int id, [FromBody] UpdateCartItemDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var items = await _cartRepository.GetByUserIdAsync(userId);
            var cartItem = items.FirstOrDefault(c => c.Id == id);

            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found." });
            }

            cartItem.Quantity = dto.Quantity;
            await _cartRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var userId = GetCurrentUserId();
            var items = await _cartRepository.GetByUserIdAsync(userId);
            var cartItem = items.FirstOrDefault(c => c.Id == id);

            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found." });
            }

            _cartRepository.RemoveItem(cartItem);
            await _cartRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
