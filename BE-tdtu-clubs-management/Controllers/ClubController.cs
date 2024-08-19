using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BE_tdtu_clubs_management.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using BE_tdtu_clubs_management.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
namespace BE_tdtu_clubs_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClubController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        private readonly IEmailService _emailService;


        public ClubController(ApplicationDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        // DELETE: api/club/5
        [HttpDelete("delete-member/{id}")]
        public async Task<IActionResult> DeleteClub(int id)
        {
            var record = await _context.Club_Members.FindAsync(id);
            if (record == null)
            {
                return NotFound(new { msg = "Không tìm thấy thành viên", success = false });
            }

            _context.Club_Members.Remove(record);
            await _context.SaveChangesAsync();
            return Ok("Thành Công");
        }
        [HttpGet("all-member")]
        public async Task<IActionResult> GetAllMember()
        {
            // Lấy ID của user từ token
            var userId = GetUserIdFromToken();
            if (userId == null)
            {
                return Unauthorized(new { msg = "Unauthorized", success = false });
            }

            // Giả sử rằng bạn có một trường trong bảng Clubs để xác định người quản lý
            var managedClubs = await _context.Clubs
                .Where(c => c.Manager_Id == userId)
                .Select(c => c.Id)
                .ToListAsync();

            if (!managedClubs.Any())
            {
                return NotFound(new { msg = "Không tìm thấy câu lạc bộ nào mà bạn quản lý", success = false });
            }

            var members = await (from cm in _context.Club_Members
                                 join a in _context.Account on cm.Student_id equals a.student_Id
                                 join b in _context.Clubs on cm.Club_id equals b.Id
                                 where managedClubs.Contains(cm.Club_id)
                                 select new
                                 {
                                     cm.Club_id,
                                     b.Club_name,
                                     cm.Id,
                                     cm.Student_id,
                                     cm.Status,
                                     cm.Role,
                                     a.full_name, // Lấy từ bảng Account
                                     a.email // Lấy từ bảng Account
                                 }).ToListAsync();

            return Ok(new { msg = "Thành công", success = true, members });
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
        [HttpGet("accept-member/{id}")]
        public async Task<IActionResult> AcceptMember(int id)
        {
            try
            {
                var member = await _context.Club_Members.FindAsync(id);
                if (member == null) return NotFound("Khong tim thay du lieu thanh vien");
                member.Status = "3";
                await _context.SaveChangesAsync();
                return Ok(new { msg = "Thành công", success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { msg = "Đã xảy ra lỗi", success = false, error = ex.Message });
            }
        }
        [HttpGet("cancel-member/{id}")]
        public async Task<IActionResult> CancelMember(int id)
        {
            try
            {
                var club = await _context.Club_Members.FindAsync(id);
                if (club == null) return NotFound("Khong tim thay du lieu thanh vien");
                club.Status = "2";
                await _context.SaveChangesAsync();
                return Ok(new { msg = "Đã Từ Chối Thành Viên", success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { msg = "Đã xảy ra lỗi", success = false, error = ex.Message });
            }
        }
        [HttpPost("create-event")]
        public async Task<IActionResult> CreateEvent([FromBody] Events events)
        {
            if (events == null)
            {
                return BadRequest(new { msg = "Dữ liệu không hợp lệ", success = false });
            }

            // Lấy UserId từ token
            var userId = GetUserIdFromToken();
            if (userId == null)
            {
                return Unauthorized(new { msg = "Không thể xác thực người dùng", success = false });
            }

            // Gán UserId vào sự kiện
            events.Event_manager = userId;

            try
            {
                // Thêm sự kiện mới vào database
                _context.Events.Add(events);
                await _context.SaveChangesAsync();
                return Ok(new { msg = "Thêm sự kiện thành công", success = true, data = events });
            }
            catch (Exception ex)
            {
                // Ghi lại lỗi chi tiết
                var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { msg = "Đã xảy ra lỗi khi lưu sự kiện", error = innerExceptionMessage });
            }
        }
        [HttpGet("all-event")]
        public async Task<IActionResult> GetAllEvent()
        {
            try
            {
                var managerId = GetUserIdFromToken();

                if (string.IsNullOrEmpty(managerId))
                {
                    return Unauthorized(new { msg = "Không thể xác định danh tính của người quản lý" });
                }

                var events = await _context.Events
                    .Where(e => e.Event_manager == managerId)
                    .ToListAsync();

                return Ok(events);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và trả về response thích hợp
                return StatusCode(500, new { msg = "Đã xảy ra lỗi khi lấy danh sách sự kiện", error = ex.Message });
            }
        }
        [HttpGet("search-event/{key}")]
        public async Task<IActionResult> SearchEvent(string key)
        {
            try
            {
                var managerId = GetUserIdFromToken();

                if (string.IsNullOrEmpty(managerId))
                {
                    return Unauthorized(new { msg = "Không thể xác định danh tính của người quản lý" });
                }

                // Thực hiện truy vấn cơ sở dữ liệu để tìm kiếm các bản tin có tiêu đề chứa từ khóa
                var matchingEvent = await _context.Events
                    .Where(n => n.Event_name.Contains(key) && n.Event_manager == managerId)
                    .ToListAsync();
                // Kiểm tra xem có bản tin nào khớp không
                if (matchingEvent == null || !matchingEvent.Any())
                {
                    return NotFound(new { msg = "Không tìm thấy tin tức với từ khóa này", success = false });
                }
                // Trả về kết quả tìm kiếm cho khách hàng
                return Ok(new { msg = "Thành công", success = true, data = matchingEvent });
            }
            catch (Exception ex)
            {
                // Xử lý ngoại lệ và trả về thông báo lỗi
                return BadRequest(new { msg = "Đã xảy ra lỗi", success = false, error = ex.Message });
            }
        }
        [HttpGet("event/{id}")]
        public async Task<IActionResult> GetEventById(int id)
        {
            var events = await _context.Events.FindAsync(id);
            if (events == null) return NotFound("Sự Kiện Không Tồn Tại");
            return Ok(events);
        }
        [HttpGet("club-member/{id}")]
        public async Task<IActionResult> GetAllMemberByClub(int id)
        {
            var events = await _context.Events.FindAsync(id);
            if (events == null) return NotFound("Không Tìm Thấy Sự Kiện Đang Diễn Ra");
            var manager_id = events.Event_manager;
            var club = await _context.Clubs.FirstOrDefaultAsync(c => c.Manager_Id == events.Event_manager);
            if (club == null) return NotFound("Không Tìm Thấy CLB");
            var members = await (from cm in _context.Club_Members
                                 join a in _context.Account on cm.Student_id equals a.student_Id
                                 where cm.Club_id == club.Id
                                 select new
                                 {
                                     cm.Student_id,
                                     a.full_name
                                 }).ToListAsync();
            if (members == null || members.Count == 0) return NotFound("Không Tìm Thấy Thành Viên Nào Trong CLB");
            return Ok(members);
        }
        [HttpPost("create-task")]
        public async Task<IActionResult> CreateTask([FromBody] Event_Task event_task)
        {
            if (event_task == null)
            {
                return BadRequest(new { msg = "Dữ liệu không hợp lệ", success = false });
            }
            try
            {
                // Thêm task mới vào database
                _context.Tasks.Add(event_task);
                await _context.SaveChangesAsync();
                var user = await _context.Account.FindAsync(event_task.Student_Id);
                if (user == null)
                {
                    return NotFound(new { msg = "Không tìm thấy sinh viên", success = false });
                }
                var envt = await _context.Events.FindAsync(event_task.Event_Id);
                string subject = "Thông Báo Sự Kiện";
                string message = $"<p>Xin chào {user.full_name},</p><p>Để hoàn thành tốt sự kiện {envt.Event_name}, Ban quản lý Câu Lạc Bộ giao cho bạn nhiệm vụ để hỗ trợ sự kiện nhằm tạo điều kiện cho sự kiện được diễn ra tốt đẹp, mang lại giá trị cho sinh viên và nhà trường.</br> Vui lòng truy cập vào: http://127.0.0.1:5173/student/student-task</p>";
                try
                {
                    await _emailService.SendEmailAsync(user.email, subject, message);
                }
                catch (System.Exception)
                {
                    return BadRequest(new { message = "Gửi Mã Xác Thực Không Thành Công. Vui Lòng Thử Lại" });
                }
                return Ok(new { msg = "Thêm sự kiện thành công", success = true, data = event_task });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và trả về phản hồi thích hợp
                return StatusCode(500, new { msg = "Đã xảy ra lỗi khi tạo task", error = ex.Message });
            }
        }
        [HttpGet("tasks-by-event/{eventId}")]
        public async Task<IActionResult> GetTasksByEventId(int eventId)
        {
            try
            {
                // Lấy danh sách các task thuộc eventId
                var tasks = await _context.Tasks
                                          .Where(task => task.Event_Id == eventId)
                                          .ToListAsync();
                // Kiểm tra xem có task nào không
                if (tasks == null || !tasks.Any())
                {
                    return NotFound(new { msg = "Không tìm thấy task nào cho sự kiện này", success = false });
                }

                return Ok(new { success = true, tasks });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và trả về response thích hợp
                return StatusCode(500, new { msg = "Đã xảy ra lỗi khi lấy danh sách task", error = ex.Message });
            }
        }
        [HttpGet("my-task")]
        public async Task<IActionResult> MyTask()
        {
            try
            {
                var studentId = GetUserIdFromToken();

                if (string.IsNullOrEmpty(studentId))
                {
                    return Unauthorized(new { msg = "Dữ liệu không tồn tại" });
                }

                var tasks = await _context.Tasks
                    .Where(e => e.Student_Id == studentId)
                    .ToListAsync();

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và trả về response thích hợp
                return StatusCode(500, new { msg = "Đã xảy ra lỗi khi lấy danh sách sự kiện", error = ex.Message });
            }
        }
        [HttpPost("report-task")]
        public async Task<IActionResult> ReportTask([FromBody] Report report)
        {
            try
            {
                var studentId = GetUserIdFromToken();
                if (studentId == null)
                {
                    return Unauthorized(new { msg = "Không thể xác thực người dùng", success = false });
                }

                // Kiểm tra nếu `report` hoặc `report.Task_Id` là null
                if (report == null || string.IsNullOrEmpty(report.Task_Id))
                {
                    return BadRequest(new { msg = "Dữ liệu không hợp lệ", success = false });
                }

                // Chuyển đổi `Task_Id` từ string sang int
                if (!int.TryParse(report.Task_Id, out int taskId))
                {
                    return BadRequest(new { msg = "Task_Id không hợp lệ", success = false });
                }

                report.Student_Id = studentId;
                _context.Reports.Add(report);
                await _context.SaveChangesAsync();

                // Tìm task bằng Task_Id đã được chuyển đổi
                var task = await _context.Tasks.FindAsync(taskId);
                if (task == null)
                {
                    return NotFound(new { msg = "Không tìm thấy task tương ứng", success = false });
                }

                task.Task_Status = "2";
                _context.Tasks.Update(task);
                await _context.SaveChangesAsync();

                return Ok(new { msg = "Báo cáo tiến độ thành công", success = true, report });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { msg = "Đã xảy ra lỗi", error = ex.Message });
            }
        }
        [HttpGet("review-task/{id}")]
        public async Task<IActionResult> ReviewTask(int id)
        {
            try
            {
                // Chuyển đổi Task_Id về kiểu int trước khi so sánh
                var report = await _context.Reports.Where(r => r.Task_Id == id.ToString()).ToListAsync();

                // Kiểm tra xem có report nào không
                if (report == null || !report.Any())
                {
                    return NotFound(new { msg = "Không tìm thấy report nào cho task này", success = false });
                }

                return Ok(new { success = true, report });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và trả về response thích hợp
                return StatusCode(500, new { msg = "Đã xảy ra lỗi khi lấy danh sách report", error = ex.Message });
            }
        }

    }
}
