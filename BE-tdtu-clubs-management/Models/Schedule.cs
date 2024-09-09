using System.Security.Principal;
using System.ComponentModel.DataAnnotations.Schema;
namespace BE_tdtu_clubs_management.Models
{
    public class Schedules
    {
        public int Id { get; set; }
        public int Club_Id { get; set; }
        public string? Content { get; set; }
        public string? Teacher_name { get; set; }
        public string? Location { get; set; }
        public string? Date { get; set; }
        public string? Time { get; set; }
        public string? Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}