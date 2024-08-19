using System.Security.Principal;
using System.ComponentModel.DataAnnotations.Schema;
namespace BE_tdtu_clubs_management.Models
{
    public class Events
    {
        public int Id { get; set; }
        public string? Event_name { get; set; }
        public string? Event_description { get; set; }
        public string? Event_location { get; set; }
        public string? Event_image { get; set; }
        public string? Event_start { get; set; }
        public string? Event_end { get; set; }
        public string? Event_status { get; set; }
        public string? Event_manager { get; set; }

        public Events()
        {
            Event_status = "1";
        }
    }
}