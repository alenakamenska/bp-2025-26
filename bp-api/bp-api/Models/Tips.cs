using System.ComponentModel.DataAnnotations;

namespace bp_api.Models
{
    public class Tips
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Info { get; set; }
        public int? ProductId { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public Product? Product { get; set; }

        public User? User { get; set; }
        public string UserId { get; set; }
        public Category? Category { get; set; }
        public int? CategoryId { get; set; }
    }
}
