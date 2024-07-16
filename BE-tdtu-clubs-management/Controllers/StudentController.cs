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

    }
}
