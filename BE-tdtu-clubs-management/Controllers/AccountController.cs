using System.Data;


// Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;


using BE_tdtu_clubs_management.Data;
using BE_tdtu_clubs_management.Models;

namespace BE_tdtu_clubs_management.Controllers
{
    [Produces("application/json")]
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AccountController(ApplicationDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }
        // REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Account account)
        {
            if (await _context.Account.AnyAsync(u => u.student_Id == account.student_Id))
                return BadRequest("User already exists.");
            account.password = BCrypt.Net.BCrypt.HashPassword(account.password);
            _context.Account.Add(account);
            await _context.SaveChangesAsync();
            return Ok(account);
        }
        // DELETE ACCOUNT
        [HttpDelete("delete-account/{student_Id}")]
        public async Task<IActionResult> DeleteAccount(string student_Id)
        {
            try
            {
                // Tìm tài khoản để xóa từ id
                var accountToDelete = await _context.Account.FindAsync(student_Id);

                // Kiểm tra xem tài khoản có tồn tại không
                if (accountToDelete == null)
                {
                    return NotFound("Tài Khoản Không Tồn Tại.");
                }

                // Xóa tài khoản khỏi cơ sở dữ liệu
                _context.Account.Remove(accountToDelete);
                await _context.SaveChangesAsync();

                // Trả về thông báo thành công nếu xóa thành công
                return Ok("Xoá Tài Khoản Thành Công");
            }
            catch (Exception ex)
            {
                // Log lỗi nếu có lỗi xảy ra
                // _logger.LogError(ex, "An error occurred while deleting the account.");
                return StatusCode(500, "Có Lỗi Xảy Ra");
            }
        }
        // LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _context.Account.FindAsync(request.student_Id);
                if (user == null) return Unauthorized("MSSV không chính xác. Vui lòng thử lại");
                if (!BCrypt.Net.BCrypt.Verify(request.password, user.password)) return Unauthorized("Mật khẩu không chính xác. Vui lòng thử lại!");
                var token = GenerateJwtToken(user);
                return Ok(new { token });
            }
            catch (System.Exception)
            {
                return StatusCode(500, new { Message = "Có Lỗi Xảy Ra" });
            }
        }
        public class LoginRequest
        {
            public string? student_Id { get; set; }
            public string? password { get; set; }
        }
        private string GenerateJwtToken(Account user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.student_Id),
                // new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                // Thêm các Claim khác tại đây nếu cần
                new Claim("role", user.role),
                new Claim("img", user.img),
                new Claim("full_name", user.full_name)
            };

            // Khởi tạo mảng byte để lưu key ngẫu nhiên
            var keyBytes = new byte[32]; // 256 bits
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(keyBytes);
            }

            // Chuyển đổi mảng byte thành chuỗi Base64 để sử dụng làm key
            var key = Convert.ToBase64String(keyBytes);
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        // GET STUDENT INFORMATION
        [HttpGet("student-info/{student_Id}")]
        public async Task<IActionResult> GetStudentInfo(string student_Id)
        {
            var student = await _context.Account.FindAsync(student_Id);
            if (student == null)
            {
                return NotFound("Không tìm thấy dữ liệu");
            }
            return Ok(student);
        }
        [HttpPost("update-info/{student_Id}")]
        public async Task<IActionResult> UpdateStudentInfo(string student_Id, [FromBody] UpdateStudentInfoModel model)
        {
            if (model == null)
            {
                return BadRequest("Dữ liệu sai");
            }
            var student = await _context.Account.FindAsync(student_Id);
            if (student == null)
            {
                return NotFound("Không tìm thấy dữ liệu");
            }
            // Cập nhật thông tin sinh viên
            student.full_name = model.full_name;
            student.address = model.address;
            student.phone = model.phone;
            student.img = model.img;
            student.email = model.email;
            if (!string.IsNullOrEmpty(model.old_password) && !string.IsNullOrEmpty(model.new_password))
            {
                // Xác thực mật khẩu cũ
                if (!BCrypt.Net.BCrypt.Verify(model.old_password, student.password))
                {
                    return BadRequest("Mật khẩu cũ không chính xác");
                }

                // Mã hóa mật khẩu mới
                student.password = BCrypt.Net.BCrypt.HashPassword(model.new_password);
            }

            _context.Account.Update(student);
            await _context.SaveChangesAsync();

            return Ok(new { msg = "Cập nhật thông tin thành công", student });
        }
        [HttpGet("find-account/{student_Id}")]
        public async Task<IActionResult> FindAccount(string student_Id)
        {
            try
            {
                if (string.IsNullOrEmpty(student_Id))
                {
                    return BadRequest(new { Message = "Student ID is required." });
                }
                var account = await _context.Account.FindAsync(student_Id);
                if (account != null)
                {
                    return Ok(new { Message = "Account exists.", Exists = true, account });
                }
                else
                {
                    return NotFound(new { Message = "Không tìm thấy tài khoản", Exists = false });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Error = ex.Message });
            }
        }
        [HttpPost("send-code")]
        public async Task<IActionResult> SendCode([FromBody] SendCodeRequest request)
        {
            // Console.WriteLine($"Received email: {request.email}");

            // Your code to send the email or other logic
            string verificationCode = GenerateRandomCode();
            var otp = new OTP
            {
                Code = verificationCode,
                Email = request.email,
                ExpiryTime = DateTime.UtcNow.AddMinutes(5) // OTP expires in 5 minutes
            };
            _context.OTPs.Add(otp);
            await _context.SaveChangesAsync();
            string subject = "Your Verification Code";
            string message = $"<p>Your verification code is: {verificationCode}</p>";
            try
            {
                await _emailService.SendEmailAsync(request.email, subject, message);
            }
            catch (System.Exception)
            {
                return BadRequest(new { message = "Gửi Mã Xác Thực Không Thành Công. Vui Lòng Thử Lại" });
            }
            return Ok(new { message = "Email received.", success = true });
        }
        public class SendCodeRequest
        {
            public string? email { get; set; }
        }
        private string GenerateRandomCode()
        {
            Random random = new Random();
            const string chars = "0123456789";
            return new string(Enumerable.Repeat(chars, 6)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }


        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var otp = await _context.OTPs.FindAsync(request.Code);
            if (otp == null)
            {
                return NotFound(new { msg = "Mã Xác Thực Không Tồn Tại" });
            }
            var student = await _context.Account.FirstOrDefaultAsync(a => a.email == otp.Email);
            if (student == null)
            {
                return NotFound("Tài Khoản Không Tồn Tại");
            }
            student.password = BCrypt.Net.BCrypt.HashPassword(request.Password);
            _context.Account.Update(student);
            _context.OTPs.Remove(otp);
            await _context.SaveChangesAsync();
            return Ok(new { msg = "Mật Khẩu Thay Đổi Thành Công!", success = true });
        }
        public class ChangePasswordRequest
        {
            public string? Code { get; set; }
            public string? Password { get; set; }
        }
    }
}
