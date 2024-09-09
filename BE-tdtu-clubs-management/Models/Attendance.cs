using System.Security.Principal;
using System.ComponentModel.DataAnnotations.Schema;
namespace BE_tdtu_clubs_management.Models
{
    public class Attendances
    {
        public int Id { get; set; }
        public int Club_Id { get; set; }
        public int Schedules_Id { get; set; }
        public string? Student_Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}