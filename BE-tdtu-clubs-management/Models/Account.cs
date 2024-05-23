using System.Security.Principal;
using System.ComponentModel.DataAnnotations.Schema;
namespace BE_tdtu_clubs_management.Models
{
    public class Account
    {
        public int Id { get; set; }
        public string student_Id { get; set; }
        public string full_name { get; set; }
        public string email { get => $"{student_Id}@gmail.com"; }
        public string password { get; set; }
        public string phone { get; set; }
        public string address { get; set; }
        public string img { get; set; }
        public string role { get; set; }
        // Constructor để khởi tạo giá trị mặc định cho role
        public Account()
        {
            role = "1";
            phone = "";
            address = "";
            img = "";
        }
    }
}