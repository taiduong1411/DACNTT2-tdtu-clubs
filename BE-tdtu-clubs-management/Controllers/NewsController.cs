using Microsoft.AspNetCore.Mvc;
using BE_tdtu_clubs_management.Data;
using BE_tdtu_clubs_management.Models;
using BE_tdtu_clubs_management.Hubs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CloudinaryDotNet;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.SignalR;
namespace BE_tdtu_clubs_management.Controllers
{
    [Route("api/news")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly CloudinaryService _cloudinaryService;
        private readonly IHubContext<NotificationHub> _hubContext;
        public NewsController(ApplicationDbContext context, CloudinaryService cloudinaryService, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
            _hubContext = hubContext;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddNews([FromBody] News news)
        {
            if (news == null)
            {
                return BadRequest(new { msg = "Invalid news data", success = false });
            }
            news.GenerateSlug(); // Tạo slug từ tiêu đề
            _context.News.Add(news);
            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.SendAsync("BlogNotification", 1);
            return Ok(new { msg = "News added successfully", success = true });
        }
        [HttpGet("all-news-table")]
        public async Task<IActionResult> AllNews()
        {
            var newsList = await _context.News.OrderByDescending(n => n.CreatedAt).ToListAsync();
            return Ok(newsList);
        }
        [HttpGet("all-news")]
        public async Task<IActionResult> AllNewsByStatus()
        {
            var newsList = await _context.News.Where(n => n.Status == "3").OrderByDescending(n => n.CreatedAt).ToListAsync();
            return Ok(newsList);
        }
        [HttpGet("all-news-pagination")]
        public async Task<IActionResult> AllNewsPagination(int pageNumber = 1, int pageSize = 9)
        {
            // var newsList = await _context.News.Where(n => n.Status == true).OrderByDescending(n => n.CreatedAt).ToListAsync();
            // return Ok(newsList);
            try
            {
                var newsList = await _context.News.Where(n => n.Status == "3").OrderByDescending(n => n.CreatedAt).ToListAsync();

                // Tính toán số lượng trang và phân trang dữ liệu
                int totalItems = newsList.Count;
                // Console.WriteLine("count", totalItems);
                int totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

                // Phân trang dữ liệu
                var pagedNewsList = newsList
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                // Trả về kết quả phân trang cho khách hàng
                return Ok(new
                {
                    currentPage = pageNumber,
                    pageSize,
                    totalPages,
                    totalItems,
                    data = pagedNewsList,
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { msg = "Đã xảy ra lỗi", success = false, error = ex.Message });
            }
        }
        [HttpPost("delete-many-news")]
        public async Task<IActionResult> DeleteManyNews([FromBody] List<int> ids)
        {
            try
            {
                var newsToDelete = await _context.News.Where(n => ids.Contains(n.Id)).ToListAsync();

                if (newsToDelete == null || !newsToDelete.Any())
                {
                    return NotFound(new { msg = "Không tìm thấy dữ liệu", success = false });
                }

                // Xóa hình ảnh từ Cloudinary trước khi xóa tin tức từ DB
                foreach (var news in newsToDelete)
                {
                    // Giả sử mỗi bản tin có thuộc tính `ImagePublicId` để lưu public ID của hình ảnh trên Cloudinary
                    if (!string.IsNullOrEmpty(news.Public_Id))
                    {
                        var deletionResult = await _cloudinaryService.DeleteImageAsync(news.Public_Id);
                        if (deletionResult.Result != "ok")
                        {
                            return BadRequest(new { msg = "Không thể xóa hình ảnh", success = false });
                        }
                    }
                }
                _context.News.RemoveRange(newsToDelete);
                await _context.SaveChangesAsync();
                return Ok(new { msg = "Đã xóa thành công các tin tức.", success = true });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { msg = $"Lỗi Hệ Thống: {ex.Message}", success = false });
            }
        }
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetNewsDetail(string slug)
        {
            var news = await _context.News.FirstOrDefaultAsync(n => n.Slug == slug);

            if (news == null)
            {
                return NotFound(new { msg = "Không tìm thấy tin tức", success = false });
            }

            return Ok(new { msg = "Thành công", success = true, news });
        }
        [HttpGet("tag/{tag}")]
        public async Task<IActionResult> GetNewsByTag(string tag, int pageNumber = 1, int pageSize = 5)
        {
            try
            {
                // Lấy tất cả tin tức từ cơ sở dữ liệu
                var allNews = await _context.News.ToListAsync();
                // Lọc tin tức chỉ giữ lại các tin có tag được yêu cầu
                var newsList = allNews
                    .Where(n => n.HashTag != null && n.HashTag.Any(ht => ht.Contains(tag)) && n.Status == "3")
                    .OrderByDescending(n => n.CreatedAt)
                    .ToList();

                // Tính toán số lượng trang và phân trang dữ liệu
                int totalItems = newsList.Count;
                int totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

                // Phân trang dữ liệu
                var pagedNewsList = newsList
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                // So sánh ngày tạo của các tin tức với ngày hiện tại
                var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);
                var newestNewsIds = newsList
                    .Where(n => n.CreatedAt >= sevenDaysAgo)
                    .OrderByDescending(n => n.CreatedAt)
                    .Take(3) // Hoặc số lượng bạn muốn
                    .Select(n => n.Id)
                    .ToList();
                // Trả về kết quả phân trang cho khách hàng
                return Ok(new
                {
                    currentPage = pageNumber,
                    pageSize,
                    totalPages,
                    totalItems,
                    data = pagedNewsList,
                    newNews = newestNewsIds
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { msg = "Đã xảy ra lỗi", success = false, error = ex.Message });
            }
        }
        [HttpGet("search-news/{key}")]
        public async Task<IActionResult> SearchNews(string key)
        {
            try
            {
                // Thực hiện truy vấn cơ sở dữ liệu để tìm kiếm các bản tin có tiêu đề chứa từ khóa
                var matchingNews = await _context.News
                    .Where(n => n.Title.Contains(key) && n.Status == "3")
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
    }
}
