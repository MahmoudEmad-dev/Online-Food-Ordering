using System.Collections.Generic;
using System.Threading.Tasks;
using FoodOrderAPI.Models;

namespace FoodOrderAPI.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task CreateAsync(Order order);
        Task<Order?> GetByIdAsync(int id);
        Task<IEnumerable<Order>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Order>> GetAllAsync();
        Task<bool> SaveChangesAsync();
    }
}
