using bp_api.Data;
using bp_api.DTO;
using bp_api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bp_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TipsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Tips
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tips>>> GetTips(
             [FromQuery] string? category,
             [FromQuery] string? searchTerm,
             [FromQuery] string? sortOrder,
             [FromQuery] int page = 1,
             [FromQuery] int pageSize = 10)
        {
            var query = _context.Tips.AsQueryable();

            if (!string.IsNullOrEmpty(category) && category != "Vše")
            {
                query = query.Where(t => t.Category.Name == category);
            }

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(t => t.Name.ToLower().Contains(searchTerm.ToLower()));
            }

            query = sortOrder switch
            {
                "nameAsc" => query.OrderBy(p => p.Name),
                _ => query.OrderBy(p => p.Id)
            };
            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            if (page < 1) page = 1;
            if (page > totalPages && totalPages > 0) page = totalPages;

            var businesses = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = page,
                Items = businesses
            });
        }

        // GET: api/Tips/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tips>> GetTips(int id)
        {
            var tips = await _context.Tips.FindAsync(id);

            if (tips == null)
            {
                return NotFound();
            }

            return tips;
        }

        // PUT: api/Tips/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutTips(int id, Tips tips)
        {
            if (id != tips.Id)
            {
                return BadRequest();
            }

            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            var existingTip = await _context.Tips.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);

            if (existingTip == null) return NotFound();

            if (existingTip.UserId != currentUserId)
            {
                return StatusCode(403, "Nelze upravovat radu, která není Vaše");
            }

            _context.Entry(tips).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Tips
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Tips>> PostTips(TipDTO dto)
        {
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Uživatel není přihlášen");
            }

            var tip = new Tips
            {
                Name = dto.Name,
                Info = dto.Info,
                ProductId = dto.ProductId,
                UserId = currentUserId ,
                CategoryId = dto.CategoryId,
            };

            _context.Tips.Add(tip);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTips", new { id = tip.Id }, tip);
        }

        // DELETE: api/Tips/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTips(int id)
        {
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            var tip = await _context.Tips
                .Include(t => t.Product)
                    .ThenInclude(p => p.Business)
                        .ThenInclude(b => b.Users)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tip == null) return NotFound();

            if (tip.ProductId == null || tip.Product?.Business == null)
            {
                if (tip.UserId != currentUserId)
                {
                    return StatusCode(403, "Tato rada nemá vazbu na produkt. Smazat ji může pouze autor");
                }
            }
            else
            {
                bool isTeamMember = tip.Product.Business.Users.Any(u => u.Id == currentUserId);

                if (!isTeamMember && tip.UserId != currentUserId && !User.IsInRole("Admin"))
                {
                    return StatusCode(403, "Nejste členem týmu tohoto obchodu");
                }
            }

            _context.Tips.Remove(tip);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TipsExists(int id)
        {
            return _context.Tips.Any(e => e.Id == id);
        }

        //GET: api/Tips/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Business>>> GetUserBusinesses(string userId)
        {
            var businesses = await _context.Tips
                .Where(t => t.UserId == userId)
                .ToListAsync();

            return Ok(businesses);
        }

    }
}
