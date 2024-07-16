using System.Security.Principal;
using System.ComponentModel.DataAnnotations.Schema;
namespace BE_tdtu_clubs_management.Models
{
    public class Mails
    {
        public int Id { get; set; }
        public string? Subject { get; set; }
        public string? Content { get; set; }
        public string? Sender_Id { get; set; }
        public string? Receiver_Id { get; set; }
        public string? Image { get; set; }
        public bool? IsReading { get; set; }
        public bool? IsSenderHidden { get; set; }
        public bool? IsReceiverHidden { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Mails()
        {
            IsReading = false;
            Image = "";
            IsSenderHidden = false;
            IsReceiverHidden = false;
        }
    }
}