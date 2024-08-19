using System.Security.Principal;
using System.ComponentModel.DataAnnotations.Schema;
namespace BE_tdtu_clubs_management.Models
{
    public class Club_Members
    {
        public int Id { get; set; }
        public int Club_id { get; set; }
        public string? Student_id { get; set; }
        public string? Status { get; set; }
        public string? Role { get; set; }
    }
}