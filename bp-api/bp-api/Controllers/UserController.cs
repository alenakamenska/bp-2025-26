using bp_api.Data;
using bp_api.DTO;
using bp_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace bp_api.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IConfiguration _configuration;

        public UserController(AppDbContext context, UserManager<User> userManager, RoleManager<Role> roleManager, IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        //GET: api/Users/user/5
        [HttpGet("user")]
        [Authorize]
        public async Task<IActionResult> GetUser()
        {
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(currentUserId);
            if (user == null) return NotFound();

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Roles = roles 
            });
        }

        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> PutUser([FromBody] UserDTO dto)
        {
            string currentIdp = "Local";
            var authHeader = Request.Headers["Authorization"].ToString();

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                currentIdp = jwtToken.Claims.FirstOrDefault(c => c.Type == "idp")?.Value ?? "Local";
            }
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (currentUserId == null) return Unauthorized("Uživatel není přihlášen");

            var user = await _userManager.FindByIdAsync(currentUserId);
            if (user == null) return NotFound("Uživatel nebyl nalezen");
            if (currentIdp == "Google")
            {
                if (user.Email != dto.Email)
                {
                    return BadRequest(new { message = "U účtu propojeného s Google nelze měnit e-mailovou adresu" });
                }
                user.PhoneNumber = dto.PhoneNumber;
            }
            else
            {
                user.Email = dto.Email;
                user.UserName = dto.Email;
                user.PhoneNumber = dto.PhoneNumber;
            }
            if (!string.IsNullOrEmpty(dto.Role))
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, dto.Role);
            }

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var newToken = await GenerateJwtToken(user, currentIdp);

            return Ok(new
            {
                token = newToken,
                message = "Profil byl aktualizován"
            });
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordDTO dto)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("Uživatel nenalezen.");

            var result = await _userManager.ChangePasswordAsync(user, dto.OldPassword, dto.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { message = "Heslo bylo úspěšně změněno." });
        }

        private async Task<string> GenerateJwtToken(User user, string idp = "Local")
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim("idp", idp),
            new Claim("hasPassword", (!string.IsNullOrEmpty(user.PasswordHash)).ToString().ToLower())
        };

            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["JwtSecret"]!));

            var token = new JwtSecurityToken(
                expires: DateTime.UtcNow.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
