using bp_api.Data;
using bp_api.DTO;
using bp_api.Models;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bp_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
             [FromQuery] string? category,
             [FromQuery] string? searchTerm,
             [FromQuery] string? sortOrder,
             [FromQuery] int page = 1,
             [FromQuery] int pageSize = 10)

        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(category) && category != "Vše")
            {
                query = query.Where(p => p.Category.Name == category);
            }

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(p => p.Name.ToLower().Contains(searchTerm.ToLower()));
            }

            query = sortOrder switch
            {
                "priceAsc" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
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

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // PUT: api/Products/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Business")]
        public async Task<IActionResult> PutProduct(int id, [FromBody] Product product)
        {
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId)) return Unauthorized();

            if (id != product.Id) return BadRequest("ID v URL neodpovídá ID produktu");

            var existingProduct = await _context.Products
                .Include(p => p.Business)
                    .ThenInclude(b => b.Users)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existingProduct == null) return NotFound("Produkt nebyl nalezen");

            if (existingProduct.Business == null || !existingProduct.Business.Users.Any(u => u.Id == currentUserId))
            {
                return StatusCode(403, "Nemáte oprávnění upravovat produkty tohoto podniku");
            }

            existingProduct.Name = product.Name;
            existingProduct.Price = product.Price;
            existingProduct.Info = product.Info;
            existingProduct.ImageURL = product.ImageURL;
            existingProduct.CategoryId = product.CategoryId;

            if (existingProduct.Price < 0) return BadRequest("Cena nesmí být záporná");

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }
        // POST: api/Products
        [HttpPost]
        [Authorize(Roles = "Business")] 
        public async Task<ActionResult<Product>> PostProduct(ProductDTO dto)
        {
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Uživatel není přihlášen");
            }

            var user = await _context.Users.FindAsync(currentUserId);

            var business = await _context.Businesses
            .Include(b => b.Users)
            .FirstOrDefaultAsync(b => b.Id == dto.BusinessId);

            if (business == null)
            {
                return NotFound("Zahradnictví nebylo nalezeno");
            }

            if (user == null)
            {
                return BadRequest("Uživatel nebyl nalezen");
            }

            if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest("Název produktu je povinný");

            if (!business.Users.Any(u => u.Id == currentUserId))
            {
                return StatusCode(403, "Nemáte oprávnění přidávat produkty k tomuto podniku");
            }

            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                ImageURL = dto.ImageURL,
                Info = dto.Info,
                CategoryId = dto.CategoryId,
                BusinessId = dto.BusinessId
            };
            if (product.Price < 0)
            {
                return BadRequest("Předmět nesmí mít zápornou cenu");
            }
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Business")] 
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId)) return Unauthorized();

            var product = await _context.Products
                .Include(p => p.Business)
                    .ThenInclude(b => b.Users)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            if (product.Business == null || !product.Business.Users.Any(u => u.Id == currentUserId))
            {
                return StatusCode(403, "Nemáte oprávnění smazat tento produkt");
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }

        // GET: api/Products/businessId/5
        [HttpGet("business/{businessId}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetBusinessProducts(int? businessId)
        {
            var products = await _context.Products
                            .Include(p => p.Category)
                            .Where(b => b.BusinessId == businessId)
                            .ToListAsync();

            return Ok(products);

        }

        [HttpGet("{businessId}/export-csv")]
        public async Task<IActionResult> ExportProductsToCsv(int businessId)
        {
            var products = await _context.Products
                .Where(p => p.BusinessId == businessId)
                .ToListAsync();

            if (products == null || !products.Any())
                return NotFound("Žádné produkty k exportu");

            var csv = new StringBuilder();
            csv.AppendLine("Název;Cena (Kč);Popis");

            foreach (var p in products)
            {
                string name = p.Name?.Replace(";", ",");
                string info = p.Info?.Replace(";", ",").Replace("\n", " ").Replace("\r", "");

                csv.AppendLine($"{name};{p.Price};{info}");
            }

            var encoding = Encoding.UTF8;
            byte[] bom = encoding.GetPreamble();
            byte[] content = encoding.GetBytes(csv.ToString());
            byte[] finalFile = bom.Concat(content).ToArray();

            return File(
                finalFile,
                "text/csv; charset=utf-8",
                $"export_produktu_{DateTime.Now:yyyyMMdd}.csv"
            );
        }

        // GET: api/Products/businessId/5
        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<Tips>>> GetTipsByProduct(int productId)
        {
            var tips = await _context.Tips
                .Where(t => t.ProductId == productId)
                .ToListAsync();
            return Ok(tips);
        }
    }
}
