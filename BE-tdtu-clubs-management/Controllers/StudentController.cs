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
    [Route("api/student")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public StudentController(ApplicationDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }
        [HttpPost("create-club")]
        public async Task<IActionResult> CreateClub([FromBody] Clubs club)
        {
            if (club == null)
            {
                return BadRequest(new { msg = "Invalid news data", success = false });
            }
            _context.Clubs.Add(club);
            await _context.SaveChangesAsync();
            return Ok(new { msg = "Tạo yêu cầu mở CLB thành công !!!", success = true });
        }
        [HttpGet("all-clubs")]
        public async Task<IActionResult> AllClub()
        {
            var clubs = await _context.Clubs.ToListAsync();
            return Ok(clubs);
        }
        [HttpGet("club-detail/{id}")]
        public async Task<IActionResult> GetClubById(int id)
        {
            var club = await _context.Clubs.FindAsync(id);
            var userId = GetUserIdFromToken();
            var isJoin = await _context.Club_Members.AnyAsync(a => a.Student_id == userId && a.Id == id);
            return Ok(new { msg = "Thành công", success = true, club = club, isJoin = isJoin });
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
        [HttpPost("join-club")]
        public async Task<IActionResult> JoinClub([FromBody] DataStudent dataStudent)
        {
            if (dataStudent == null || string.IsNullOrEmpty(dataStudent.Student_Id) || dataStudent.Club_Id <= 0)
            {
                return BadRequest(new { msg = "Dữ liệu không hợp lệ", success = false });
            }

            // Kiểm tra xem học sinh đã tham gia câu lạc bộ do chưa
            var existingMembership = await _context.Club_Members
                .FirstOrDefaultAsync(cm => cm.Student_id == dataStudent.Student_Id && cm.Club_id == dataStudent.Club_Id);

            if (existingMembership != null)
            {
                return BadRequest(new { msg = "Học sinh đã tham gia câu lạc bộ này hoặc đang chờ xét duyệt !!!", success = false });
            }

            // Thêm học sinh vào câu lạc bộ
            var clubMember = new Club_Members
            {
                Student_id = dataStudent.Student_Id,
                Club_id = dataStudent.Club_Id,
                Status = "1",
                Role = "member"
            };

            _context.Club_Members.Add(clubMember);
            await _context.SaveChangesAsync();

            return Ok(new { msg = "Đã Gửi Yêu Cầu Tham Gia Câu Lạc Bộ Thành Công !", success = true });
        }
        public class DataStudent
        {
            public string? Student_Id { get; set; }
            public int Club_Id { get; set; }
        }
    }
}
