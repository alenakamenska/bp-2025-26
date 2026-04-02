using System.Text.Json.Serialization;

namespace bp_api.Models
{
    public class Business
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? City { get; set; }
        public string? Street { get; set; }
        public string? HouseNumber { get; set; }
        public string? ImageURL  { get; set; }
        public string? Info { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public bool IsVerified { get; set; }
        public string ICO { get; set; }
        public string OwnerId { get; set; }

        [JsonIgnore]
        public ICollection<User>? Users { get; set; }
        [JsonIgnore]
        public ICollection<Product>? Products { get; set; }
        [JsonIgnore]
        public ICollection<OpeningHours>? OpeningHours { get; set; }
    }
}
