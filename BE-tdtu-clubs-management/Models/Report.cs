using System.Security.Principal;
using System.ComponentModel.DataAnnotations.Schema;
namespace BE_tdtu_clubs_management.Models
{
    public class Report
    {
        public int Id { get; set; }
        public string? Task_Id { get; set; }
        public string? Student_Id { get; set; }
        public string? Task_Report { get; set; }
        public string? Task_Percent { get; set; }
        public string? ImgUrl { get; set; }
        public string? ImgId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}