using bp_api.Data;
using bp_api.Models;
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
    public class OpeningHoursController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OpeningHoursController(AppDbContext context)
        {
            _context = context;
        }

        private async Task<bool> IsUserAuthorized(int businessId)
        {
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId)) return false;

            return await _context.Businesses.AnyAsync(b => b.Id == businessId && b.OwnerId == currentUserId);
        }

        // GET: api/OpeningHours
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OpeningHours>>> GetOpeningHours()
        {
            return await _context.OpeningHours.ToListAsync();
        }

        // GET: api/OpeningHours/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OpeningHours>> GetOpeningHours(string id)
        {
            var openingHours = await _context.OpeningHours.FindAsync(id);

            if (openingHours == null)
            {
                return NotFound();
            }

            return openingHours;
        }

        // PUT: api/OpeningHours/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutOpeningHours(string id, OpeningHours openingHours)
        {

            if (id != openingHours.Day)
            {
                return BadRequest();
            }

            if (!await IsUserAuthorized(openingHours.BusinessId))
            {
                return StatusCode(403, "Nemáte oprávnění měnit otevírací dobu tohoto podniku");
            }

            _context.Entry(openingHours).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OpeningHoursExists(id))
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

        // POST: api/OpeningHours
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<OpeningHours>> PostOpeningHours(OpeningHours openingHours)
        {

            if (!await IsUserAuthorized(openingHours.BusinessId))
            {
                return StatusCode(403, "Nemáte oprávnění přidávat hodiny pro tento podnik");
            }

            _context.OpeningHours.Add(openingHours);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (OpeningHoursExists(openingHours.Day))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetOpeningHours", new { id = openingHours.Day }, openingHours);
        }

        // DELETE: api/OpeningHours/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteOpeningHours(string id)
        {
            var openingHours = await _context.OpeningHours.FindAsync(id);
            if (openingHours == null)
            {
                return NotFound();
            }

            if (!await IsUserAuthorized(openingHours.BusinessId))
            {
                return StatusCode(403, "Nemáte oprávnění mazat hodiny pro tento podnik");
            }

            _context.OpeningHours.Remove(openingHours);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OpeningHoursExists(string id)
        {
            return _context.OpeningHours.Any(e => e.Day == id);
        }

        [HttpGet("business/{id}")]
        public async Task<ActionResult<IEnumerable<OpeningHours>>> GetOpeningBusinessHours(int id)
        {
            var openingHours = await _context.OpeningHours
                .Where(oh => oh.BusinessId == id)
                .ToListAsync();

            if (openingHours == null || !openingHours.Any())
            {
                return NotFound(new { message = "Otevírací hodiny nebyly nalezeny" });
            }

            return Ok(openingHours);
        }

        // PUT: api/OpeningHours/bulk
        [HttpPut("bulk")]
        [Authorize]
        public async Task<IActionResult> PutOpeningHoursBulk(List<OpeningHours> hoursList)
        {
            if (hoursList == null || !hoursList.Any())
            {
                return BadRequest("Seznam otevíracích hodin je prázdný");
            }

            if (!await IsUserAuthorized(hoursList[0].BusinessId))
            {
                return StatusCode(403, "Nemáte oprávnění měnit hodiny pro tento podnik");
            }

            foreach (var hours in hoursList)
            {
                _context.Entry(hours).State = EntityState.Modified;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return BadRequest("Nepodařilo se uložit změny, data byla mezitím změněna");
            }

            return NoContent();
        }

    }
}
