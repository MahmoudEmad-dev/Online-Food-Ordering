using System.Threading.Tasks;

namespace FoodOrderAPI.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<bool> ProcessPaymentAsync(decimal amount, string cardNumber, string expiry, string cvv);
    }
}
