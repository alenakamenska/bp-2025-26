using System.ComponentModel;
using System.Text.Json.Serialization;

namespace bp_api.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Info { get; set; }
        public decimal Price { get; set; }
        public string? ImageURL { get; set; }
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        public int BusinessId { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public Business? Business { get; set; }
        [JsonIgnore]
        public ICollection<Tips> Tips { get; set; } = new List<Tips>();

    }
}
