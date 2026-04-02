using System.Text.Json.Serialization;

namespace bp_api.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        [JsonIgnore]
        public ICollection<Tips> Tips { get; set; } = new List<Tips>();
        [JsonIgnore]
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
