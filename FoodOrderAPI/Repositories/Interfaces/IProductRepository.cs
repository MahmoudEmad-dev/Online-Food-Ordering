using System.Collections.Generic;
using System.Threading.Tasks;
using FoodOrderAPI.Models;

namespace FoodOrderAPI.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync(string? category = null);
        Task<Product?> GetByIdAsync(int id);
        Task CreateAsync(Product product);
        void Update(Product product);
        void Delete(Product product);
        Task<bool> SaveChangesAsync();
    }
}
