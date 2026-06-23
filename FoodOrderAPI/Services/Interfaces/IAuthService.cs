using System.Threading.Tasks;
using FoodOrderAPI.DTOs.Auth;

namespace FoodOrderAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
        Task<UserDto?> GetMeAsync(int userId);
    }
}
