using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using BE_tdtu_clubs_management.Models;
using BE_tdtu_clubs_management.Data;
using System.IdentityModel.Tokens.Jwt;



namespace BE_tdtu_clubs_management.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("all-news")]
        public async Task<IActionResult> GetAllNews()
        {
            var newsList = await _context.News.ToListAsync();
            return Ok(newsList);
        }
        [HttpGet("cancel-blog/{id}")]
        public async Task<IActionResult> CancelBlog(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null) return NotFound("Không tìm thấy dữ liệu");
            news.Status = "2";
            _context.News.Update(news);
            await _context.SaveChangesAsync();
            return Ok(new { msg = "Bài Viết Đã Được Huỷ" });
        }
        [HttpGet("accept-blog/{id}")]
        public async Task<IActionResult> AcceptBlog(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null) return NotFound("Không tìm thấy dữ liệu");
            news.Status = "3";
            _context.News.Update(news);
            await _context.SaveChangesAsync();
            return Ok(new { msg = "Bài Viết Đã Được Chấp Nhận" });
        }
        [HttpGet("search-blogs/{key}")]
        public async Task<IActionResult> SearchNews(string key)
        {
            try
            {
                // Thực hiện truy vấn cơ sở dữ liệu để tìm kiếm các bản tin có tiêu đề chứa từ khóa
                var matchingNews = await _context.News
                    .Where(n => n.Title.Contains(key))
                    .OrderByDescending(n => n.CreatedAt) // Sắp xếp theo thời gian tạo từ mới nhất đến cũ nhất
                    .ToListAsync();
                // Kiểm tra xem có bản tin nào khớp không
                if (matchingNews == null || !matchingNews.Any())
                {
                    return NotFound(new { msg = "Không tìm thấy tin tức với từ khóa này", success = false });
                }
                // Trả về kết quả tìm kiếm cho khách hàng
                return Ok(new { msg = "Thành công", success = true, data = matchingNews });
            }
            catch (Exception ex)
            {
                // Xử lý ngoại lệ và trả về thông báo lỗi
                return BadRequest(new { msg = "Đã xảy ra lỗi", success = false, error = ex.Message });
            }
        }
        // CLUB 
        [HttpGet("all-clubs")]
        public async Task<IActionResult> GetAllClubs()
        {
            var clubsList = await _context.Clubs.ToListAsync();
            return Ok(clubsList);
        }
        [HttpGet("search-club/{key}")]
        public async Task<IActionResult> SearchClubs(string key)
        {
            try
            {
                // Thực hiện truy vấn cơ sở dữ liệu để tìm kiếm các bản tin có tiêu đề chứa từ khóa
                var matchingClubs = await _context.Clubs
                    .Where(n => n.Club_name.Contains(key))
                    .OrderByDescending(n => n.CreatedAt) // Sắp xếp theo thời gian tạo từ mới nhất đến cũ nhất
                    .ToListAsync();
                // Kiểm tra xem có bản tin nào khớp không
                if (matchingClubs == null || !matchingClubs.Any())
                {
                    return NotFound(new { msg = "Không tìm thấy tin tức với từ khóa này", success = false });
                }
                // Trả về kết quả tìm kiếm cho khách hàng
                return Ok(new { msg = "Thành công", success = true, data = matchingClubs });
            }
            catch (Exception ex)
            {
                // Xử lý ngoại lệ và trả về thông báo lỗi
                return BadRequest(new { msg = "Đã xảy ra lỗi", success = false, error = ex.Message });
            }
        }
    }
}
