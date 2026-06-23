using System.Threading.Tasks;
using FoodOrderAPI.Services.Interfaces;

namespace FoodOrderAPI.Services.Implementations
{
    public class MockPaymentService : IPaymentService
    {
        public async Task<bool> ProcessPaymentAsync(decimal amount, string cardNumber, string expiry, string cvv)
        {
            // Simulate processing delay (1 second)
            await Task.Delay(1000);

            // Mock check: simply approve any payment that is not empty
            if (string.IsNullOrWhiteSpace(cardNumber) || string.IsNullOrWhiteSpace(expiry) || string.IsNullOrWhiteSpace(cvv))
            {
                return false;
            }

            return true;
        }
    }
}
