using bp_api.Data;
using bp_api.DTO;
using bp_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace bp_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;


        public BusinessesController(AppDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Businesses
        [HttpGet]
        public async Task<IActionResult> GetBusinesses(
             [FromQuery] string? city,
             [FromQuery] string? searchTerm,
             [FromQuery] string? sortOrder,
             [FromQuery] int page = 1,
             [FromQuery] int pageSize = 10)
        {
            var query = _context.Businesses.AsQueryable();

            if (!string.IsNullOrEmpty(city) && city != "Vše")
            {
                query = query.Where(b => b.City == city);
            }

            if(pageSize < 1)
            {
                return BadRequest("Počet položek na stránce nesmí být záporný");    
            }

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(b => b.Name.ToLower().Contains(searchTerm.ToLower()));
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
        // GET: api/Businesses/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBusiness(int id)
        {
            var business = await _context.Businesses
                .Include(b => b.Users)
                .Where(b => b.Id == id)
                .Select(b => new {
                    Id = b.Id,
                    Name = b.Name,
                    Info = b.Info,
                    imageURL = b.ImageURL,
                    houseNumber = b.HouseNumber,
                    City = b.City,
                    Street = b.Street,
                    Longitude = b.Longitude,
                    latitude = b.Latitude,
                    ico = b.ICO,
                    ownerId = b.OwnerId,
                    Owners = b.Users.Select(u => new {
                        Email = u.Email,
                        Phone = u.PhoneNumber,
                        id = u.Id
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (business == null) return NotFound();

            return Ok(business);
        }

        // PUT: api/Businesses/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Business")]

        public async Task<IActionResult> PutBusiness(int id, BusinessDTO dto)
        {
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            var business = await _context.Businesses.FindAsync(id);

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("Název podniku nesmí být prázdný");
            }

            if (business == null)
            {
                return NotFound("Podnik nebyl nalezen");
            }

            if (!(business.OwnerId == currentUserId))
            {
                return StatusCode(403, "Nelze upravovat cizí podnik");
            }

            if (business.Street != dto.Street || business.City != dto.City || business.HouseNumber != dto.HouseNumber)
            {
                try
                {
                    string address = $"{dto.Street} {dto.HouseNumber}, {dto.City}";
                    var coords = await GetCoordinatesFromAddress(address);
                    if (coords != null)
                    {
                        business.Latitude = coords.Value.lat;
                        business.Longitude = coords.Value.lon;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Geocoding při aktualizaci selhal: {ex.Message}");
                }
            }

            business.Name = dto.Name;
            business.City = dto.City;
            business.Street = dto.Street;
            business.HouseNumber = dto.HouseNumber;
            business.ImageURL = dto.ImageURL;
            business.Info = dto.Info;
            business.ICO = dto.ICO;

            _context.Entry(business).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusinessExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // POST: api/Businesses
        [HttpPost]
        [Authorize(Roles = "Business")]
        public async Task<ActionResult<Business>> PostBusiness(BusinessDTO dto)
        {
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("Název podniku nesmí být prázdný");
            }

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Uživatel není přihlášen");
            }

            var user = await _context.Users.FindAsync(currentUserId);
            if (user == null) return BadRequest("Uživatel nebyl nalezen");

            double? lat = null;
            double? lon = null;

            try
            {
                string address = $"{dto.Street} {dto.HouseNumber}, {dto.City}";
                var coords = await GetCoordinatesFromAddress(address);
                if (coords != null)
                {
                    lat = coords.Value.lat;
                    lon = coords.Value.lon;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Geocoding selhal: {ex.Message}");
            }


            var business = new Business
            {
                Name = dto.Name,
                City = dto.City,
                Street = dto.Street,
                HouseNumber = dto.HouseNumber,
                ImageURL = dto.ImageURL,
                Info = dto.Info,
                Latitude = lat, 
                Longitude = lon, 
                ICO = dto.ICO,
                IsVerified = dto.isVerified,
                OwnerId = currentUserId,
                Users = new List<User> { user }
            };

            _context.Businesses.Add(business);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBusiness), new { id = business.Id }, business);
        }

        // DELETE: api/Businesses/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBusiness(int id)
        {
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            var business = await _context.Businesses.Include(b => b.Users).FirstOrDefaultAsync(b => b.Id == id);
            if (business == null)
            {
                return NotFound();
            }

            if (!(business.OwnerId == currentUserId))
            {
                return StatusCode(403, "Nelze mazat cizí podnik");
            }

            _context.Businesses.Remove(business);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BusinessExists(int id)
        {
            return _context.Businesses.Any(e => e.Id == id);
        }

        //GET: api/Businesses/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Business>>> GetUserBusinesses(string userId)
        {
            var businesses = await _context.Businesses
                .Include(b => b.Users)
                .Where(b => b.Users.Any(u => u.Id == userId)) 
                .ToListAsync();

            return Ok(businesses);
        }

        // GET: api/Businesses/by-product/5
        [HttpGet("by-product/{productId}")]
        public async Task<ActionResult<Business>> GetBusinessByProduct(int productId)
        {
            var business = await _context.Businesses
                .FirstOrDefaultAsync(b => b.Products.Any(p => p.Id == productId));

            if (business == null)
            {
                return NotFound("K tomuto produktu nebyl nalezen žádný podnik");
            }

            return Ok(business);
        }


        // GET: api/Businesses/cities
        [HttpGet("cities")]
        public async Task<ActionResult<Business>> GetBusinessCities()
        {
            var cities = await _context.Businesses.Select(b => b.City).Distinct().ToListAsync();

            if (cities == null)
            {
                return NotFound("Nebyly nalezeny žádné města");
            }

            return Ok(cities);
        }

        [HttpGet("ares/{ico}")]
        public async Task<IActionResult> GetAresData(string ico)
        {
            string url = $"https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/{ico}";

            using var client = new HttpClient();
            try
            {
                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode) return NotFound("Subjekt nebyl nalezen");

                var content = await response.Content.ReadAsStringAsync();

                var aresData = JsonSerializer.Deserialize<dynamic>(content);

                var result = new
                {
                    data = aresData,
                    isVerified = true
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { isVerified = false, error = ex.Message });
            }
        }

        [HttpPost("{businessId}/add-colleague")]
        [Authorize(Roles = "Business")]

        public async Task<IActionResult> AddColleague(int businessId, [FromBody] string colleagueEmail)
        {
            var colleague = await _userManager.FindByEmailAsync(colleagueEmail);
            if (colleague == null)
                return NotFound("Uživatel s tímto e-mailem neexistuje");

            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            var isBusiness = await _userManager.IsInRoleAsync(colleague, "Business");

            if (!isBusiness)
            {
                return BadRequest("Uživatel není registrován jako podnikatelský subjekt");
            }

            var business = await _context.Businesses
                .Include(b => b.Users)
                .FirstOrDefaultAsync(b => b.Id == businessId);

            if (business == null) return NotFound("Podnik nenalezen");

            if (business.OwnerId != currentUserId)
                return StatusCode(403,"Pouze majitel může přidávat kolegy");
            if (business == null) return NotFound("Podnik nenalezen");

            if (!business.Users.Any(u => u.Id == colleague.Id))
            {
                business.Users.Add(colleague);
                await _context.SaveChangesAsync();
            }

            return Ok("Kolega byl úspěšně přidán");
        }

        [HttpGet("{businessId}/colleagues")]
        public async Task<IActionResult> GetColleagues(int businessId)
        {
            var business = await _context.Businesses
                .Include(b => b.Users) 
                .FirstOrDefaultAsync(b => b.Id == businessId);

            if (business == null) return NotFound();

            var colleagues = business.Users.Select(u => new {
                u.Id,
                u.Email
            });

            return Ok(colleagues);
        }

        [HttpDelete("{businessId}/remove-colleague/{userId}")]
        [Authorize(Roles = "Business")]

        public async Task<IActionResult> RemoveColleague(int businessId, string userId)
        {
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            var business = await _context.Businesses
                .Include(b => b.Users)
                .FirstOrDefaultAsync(b => b.Id == businessId);

            if (business == null) return NotFound();

            if (business.OwnerId != currentUserId)
                return StatusCode(403,"Pouze majitel může spravovat tým");

            if (userId == business.OwnerId)
                return BadRequest("Majitele nelze odebrat");

            var userToRemove = business.Users.FirstOrDefault(u => u.Id == userId);
            if (userToRemove != null)
            {
                business.Users.Remove(userToRemove);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        private async Task<(double lat, double lon)?> GetCoordinatesFromAddress(string address)
        {
            try
            {
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("User-Agent", "bp_api_student_project");

                string url = $"https://nominatim.openstreetmap.org/search?q={Uri.EscapeDataString(address)}&format=json&limit=1";

                var response = await client.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadFromJsonAsync<List<JsonElement>>();
                    if (json != null && json.Count > 0)
                    {
                        var latStr = json[0].GetProperty("lat").GetString();
                        var lonStr = json[0].GetProperty("lon").GetString();

                        return (
                            double.Parse(latStr, System.Globalization.CultureInfo.InvariantCulture),
                            double.Parse(lonStr, System.Globalization.CultureInfo.InvariantCulture)
                        );
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Chyba při geokódování: {ex.Message}");
            }
            return null;
        }
    } 
}
