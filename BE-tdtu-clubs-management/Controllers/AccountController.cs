
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
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AccountController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        // POST: api/account/register
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
        [HttpDelete("delete-account/{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            try
            {
                // Tìm tài khoản để xóa từ id
                var accountToDelete = await _context.Account.FindAsync(id);

                // Kiểm tra xem tài khoản có tồn tại không
                if (accountToDelete == null)
                {
                    return NotFound("Account not found.");
                }

                // Xóa tài khoản khỏi cơ sở dữ liệu
                _context.Account.Remove(accountToDelete);
                await _context.SaveChangesAsync();

                // Trả về thông báo thành công nếu xóa thành công
                return Ok("Account deleted successfully.");
            }
            catch (Exception ex)
            {
                // Log lỗi nếu có lỗi xảy ra
                // _logger.LogError(ex, "An error occurred while deleting the account.");
                return StatusCode(500, "An error occurred while deleting the account.");
            }
        }
        // LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var user = await _context.Account.FirstOrDefaultAsync(u => u.student_Id == loginModel.student_Id);
            if (user == null) return Unauthorized("MSSV không chính xác. Vui lòng thử lại");
            if (!BCrypt.Net.BCrypt.Verify(loginModel.password, user.password)) return Unauthorized("Mật khẩu không chính xác. Vui lòng thử lại!");
            var token = GenerateJwtToken(user);
            return Ok(new { token });
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
            var student = await _context.Account.FirstOrDefaultAsync(s => s.student_Id == student_Id);
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
            var student = await _context.Account.FirstOrDefaultAsync(s => s.student_Id == student_Id);
            if (student == null)
            {
                return NotFound("Không tìm thấy dữ liệu");
            }
            // Cập nhật thông tin sinh viên
            student.full_name = model.full_name;
            student.address = model.address;
            student.phone = model.phone;
            student.img = model.img;
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

            return Ok("Cập nhật thông tin thành công");
        }
    }
}
