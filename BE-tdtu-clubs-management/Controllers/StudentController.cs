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
        [HttpGet("my-schedule")]
        public async Task<IActionResult> GetStudentSchedule()
        {
            try
            {
                // Lấy student_id từ token
                var studentId = GetUserIdFromToken();
                if (string.IsNullOrEmpty(studentId))
                {
                    return Unauthorized(new { msg = "Không thể xác thực người dùng", success = false });
                }

                // Tìm tất cả các club mà sinh viên này tham gia
                var clubIds = await _context.Club_Members
                    .Where(cm => cm.Student_id == studentId && cm.Status == "3")
                    .Select(cm => cm.Club_id)
                    .ToListAsync();

                if (!clubIds.Any())
                {
                    return NotFound(new { msg = "Sinh viên không tham gia câu lạc bộ nào", success = false });
                }

                // Lấy lịch sinh hoạt và tên câu lạc bộ
                var schedules = await (from s in _context.Schedules
                                       join c in _context.Clubs on s.Club_Id equals c.Id
                                       where clubIds.Contains(s.Club_Id)
                                       select new
                                       {
                                           s.Id,
                                           s.Date,
                                           s.Time,
                                           s.Location,
                                           s.Content,
                                           s.Status,
                                           s.Teacher_name,
                                           ClubName = c.Club_name, // Lấy tên câu lạc bộ
                                           ClubId = c.Id
                                       }).ToListAsync();

                if (!schedules.Any())
                {
                    return NotFound(new { msg = "Không tìm thấy lịch sinh hoạt nào", success = false });
                }

                return Ok(new { msg = "Lấy lịch sinh hoạt thành công", success = true, schedules });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { msg = "Đã xảy ra lỗi khi lấy lịch sinh hoạt", success = false, error = ex.Message });
            }
        }
        [HttpPost("attendances")]
        public async Task<IActionResult> Attendances([FromBody] Attendances attendance)
        {
            try
            {
                // Lấy student_id từ token
                var studentId = GetUserIdFromToken();
                if (string.IsNullOrEmpty(studentId))
                {
                    return Unauthorized(new { msg = "Không thể xác thực người dùng", success = false });
                }

                // Thiết lập các thông tin cần thiết cho điểm danh
                attendance.Student_Id = studentId;

                // Kiểm tra nếu đã tồn tại điểm danh cho cùng lịch
                var existingAttendance = await _context.Attendances
                    .FirstOrDefaultAsync(a => a.Student_Id == studentId && a.Schedules_Id == attendance.Schedules_Id);

                if (existingAttendance != null)
                {
                    return Conflict(new { msg = "Sinh viên đã được điểm danh cho lịch sinh hoạt này", success = false });
                }

                // Thêm lịch sử điểm danh vào database
                _context.Attendances.Add(attendance);
                await _context.SaveChangesAsync();

                return Ok(new { msg = "Điểm danh thành công", success = true, data = attendance });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { msg = "Đã xảy ra lỗi khi lưu lịch sử điểm danh", success = false, error = ex.Message });
            }
        }

    }
}
