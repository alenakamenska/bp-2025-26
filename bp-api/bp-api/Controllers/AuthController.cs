using bp_api.Data;
using bp_api.DTO;
using bp_api.Models;
using bp_api.Services;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.Intrinsics.Arm;
using System.Security.Claims;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _context;
    private readonly MailSenderService _emailService;


    public AuthController(UserManager<User> userManager, RoleManager<Role> roleManager, IConfiguration configuration, AppDbContext context, MailSenderService emailService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _context = context;
        _emailService = emailService;

    }

    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO model)
    {
        if (!await _roleManager.RoleExistsAsync("Admin"))
        {
            await _roleManager.CreateAsync(new Role { Name = "Admin" });
        }
        if (!await _roleManager.RoleExistsAsync("Author"))
        {
            await _roleManager.CreateAsync(new Role
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Author",
                NormalizedName = "AUTHOR"
            });
        }


        var user = new User { UserName = model.Email, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, model.Role); 

        return Ok(new { Message = "User registered successfully" });
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            return Unauthorized(new { message = "Neplatný e-mail nebo heslo" });

        var tokenString = await GenerateJwtToken(user, "Local");
        return Ok(new
        {
            token = tokenString,
            user = new { user.Id, user.Email, user.UserName, idp = "Local" }
        });
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDTO request)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings()
        {
            Audience = new List<string> { _configuration["GoogleClientId"] }
        };

        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);
            var user = await _userManager.FindByEmailAsync(payload.Email);

            if (user == null)
            {
                user = new User { UserName = payload.Email, Email = payload.Email, EmailConfirmed = true };
                var result = await _userManager.CreateAsync(user);

                if (!result.Succeeded) return BadRequest(result.Errors);

                var roleToAssign = !string.IsNullOrEmpty(request.SelectedRole) ? request.SelectedRole : "User";
                await _userManager.AddToRoleAsync(user, roleToAssign);
            }

            var tokenString = await GenerateJwtToken(user, "Google");

            return Ok(new
            {
                token = tokenString,
                user = new { user.Id, user.Email, user.UserName, idp = "Google" }
            });
        }
        catch (Exception ex)
        {
            return BadRequest("Neplatný Google token: " + ex.Message);
        }
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

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return Ok();

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        var encodedToken = System.Net.WebUtility.UrlEncode(token); 
        var resetLink = $"https://najdi-rostlinu.vercel.app/reset-hesla?token={encodedToken}&email={user.Email}";

        await _emailService.SendResetEmailAsync(user.Email, resetLink);

        return Ok();
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return BadRequest("Neplatný požadavek");
        }

        byte[] decodedTokenBytes = WebEncoders.Base64UrlDecode(model.Token);
        string decodedToken = System.Net.WebUtility.UrlDecode(model.Token);

        var result = await _userManager.ResetPasswordAsync(user, decodedToken, model.NewPassword);

        if (result.Succeeded)
        {
            return Ok(new { message = "Heslo bylo úspěšně změněno" });
        }

        return BadRequest(result.Errors);
    }

}

