using System.Collections.Generic;
using System.Threading.Tasks;
using FoodOrderAPI.Models;

namespace FoodOrderAPI.Repositories.Interfaces
{
    public interface ICartRepository
    {
        Task<IEnumerable<CartItem>> GetByUserIdAsync(int userId);
        Task<CartItem?> GetItemAsync(int userId, int productId);
        Task AddItemAsync(CartItem item);
        void RemoveItem(CartItem item);
        Task ClearCartAsync(int userId);
        Task<bool> SaveChangesAsync();
    }
}
