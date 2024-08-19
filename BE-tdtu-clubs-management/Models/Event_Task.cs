using System.Security.Principal;
using System.ComponentModel.DataAnnotations.Schema;
namespace BE_tdtu_clubs_management.Models
{
    public class Event_Task
    {
        public int Id { get; set; }
        public string? Student_Id { get; set; }
        public string? Task_Start { get; set; }
        public string? Task_End { get; set; }
        public string? Task_Status { get; set; }
        public string? Task_Description { get; set; }
        public int Event_Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Event_Task()
        {
            Task_Status = "1";
        }
    }
}