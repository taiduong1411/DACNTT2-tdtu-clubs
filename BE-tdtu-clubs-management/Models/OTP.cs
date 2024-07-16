using System.Security.Principal;
using System.ComponentModel.DataAnnotations.Schema;
namespace BE_tdtu_clubs_management.Models
{
    public class OTP
    {
        public string? Code { get; set; }
        public string? Email { get; set; }
        public DateTime ExpiryTime { get; set; }
    }
}