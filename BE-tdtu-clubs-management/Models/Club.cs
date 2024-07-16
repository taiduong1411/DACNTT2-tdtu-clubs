using System.Security.Principal;
using System.ComponentModel.DataAnnotations.Schema;
namespace BE_tdtu_clubs_management.Models
{
    public class Clubs
    {
        public int Id { get; set; }
        public string? Club_name { get; set; }
        public string? Club_description { get; set; }
        public string? Manager_Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string? ImgUrl { get; set; }
        public string? Public_Id { get; set; }
        public string? Status { get; set; }
    }
}