using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BE_tdtu_clubs_management.Models;
using BE_tdtu_clubs_management.Data;
using BE_tdtu_clubs_management.Hubs;


using Microsoft.AspNetCore.SignalR;
using System.IdentityModel.Tokens.Jwt;

namespace BE_tdtu_clubs_management.Controllers

{
    [ApiController]
    [Route("api/mail")]
    public class MailController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;


        public MailController(ApplicationDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateMail([FromBody] Mails mail)
        {
            if (mail == null)
            {
                return BadRequest(new { msg = "Mail data is invalid", success = false });
            }
            try
            {
                // Gán giá trị mặc định cho các thuộc tính chưa được cung cấp
                // mail.Mail_Id = Guid.NewGuid().ToString();
                // mail.CreatedAt = DateTime.UtcNow;
                // mail.IsReading = false;
                _context.Mails.Add(mail);
                await _context.SaveChangesAsync();
                await _hubContext.Clients.All.SendAsync("MailNotification", 1);
                return Ok(new { msg = "Mail created successfully", success = true, data = mail });
            }
            catch (Exception ex)
            {
                return BadRequest(new { msg = "An error occurred", success = false, error = ex.Message });
            }
        }
        [HttpGet("all-mail")]
        public async Task<IActionResult> GetAllMail()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
            {
                return Unauthorized();
            }
            var mails = await _context.Mails.Where(m => m.Sender_Id == userId || m.Receiver_Id == userId).ToListAsync();
            return Ok(mails);
        }
        private string? GetUserIdFromToken()
        {
            // Lấy token từ header
            var token = HttpContext.Request.Headers["Authorization"].ToString();

            if (string.IsNullOrEmpty(token))
            {
                return null;
            }

            // Giải mã token
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadToken(token) as JwtSecurityToken;

            if (jwtToken == null)
            {
                return null;
            }

            // Lấy user ID từ claim trong token
            var userId = jwtToken.Claims.First(claim => claim.Type == "sub").Value;
            return userId;
        }
        // DELETE ONLY TEST
        [HttpDelete("delete-mail/{Id}")]
        public async Task<IActionResult> DelMail(int Id)
        {
            var mail = await _context.Mails.FindAsync(Id);
            if (mail == null)
            {
                return NotFound("Mail không tồn tại");
            }
            _context.Mails.Remove(mail);
            await _context.SaveChangesAsync();
            return Ok("Xoa Thanh Cong");
        }

        [HttpPost("delete-many-mails")]
        public async Task<IActionResult> DeleteMails([FromBody] List<int> mailIds)
        {
            // Lấy token từ header
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token == null)
            {
                return Unauthorized(new { msg = "Token không hợp lệ", success = false });
            }
            // Console.WriteLine(token);

            var mailsToDelete = await _context.Mails
                .Where(m => mailIds.Contains(m.Id))
                .ToListAsync();

            if (!mailsToDelete.Any())
            {
                return NotFound(new { msg = "Không tìm thấy mail để xóa", success = false });
            }

            // Xóa mail
            _context.Mails.RemoveRange(mailsToDelete);
            await _context.SaveChangesAsync();

            return Ok(new { msg = "Xóa mail thành công", success = true });
        }
        [HttpGet("mail-detail/{Id}")]
        public async Task<IActionResult> GetMailDetail(int Id)
        {
            // Tìm mail theo ID
            var mail = await _context.Mails.FindAsync(Id);
            if (mail == null)
            {
                return NotFound(new { msg = "Không tìm thấy mail", success = false });
            }
            var sender = await _context.Account.FindAsync(mail.Sender_Id);
            var receiver = await _context.Account.FindAsync(mail.Receiver_Id);
            if (sender == null || receiver == null)
            {
                return NotFound(new { msg = "Không tìm thấy thông tin người gửi hoặc người nhận", success = false });
            }
            // Cập nhật trạng thái isReading thành true
            mail.IsReading = true;
            await _context.SaveChangesAsync();
            var response = new
            {
                msg = "Thành công",
                success = true,
                data = new
                {
                    mail,
                    senderImg = sender.img,
                    receiverImg = receiver.img
                }
            };
            // Trả về chi tiết mail
            return Ok(new { msg = "Thành công", success = true, response });
        }
    }
}
