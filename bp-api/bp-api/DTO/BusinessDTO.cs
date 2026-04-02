using bp_api.Models;

namespace bp_api.DTO
{
    public class BusinessDTO
    {
        public string? Name { get; set; }
        public string? City { get; set; }
        public string? Street { get; set; }
        public string? HouseNumber { get; set; }
        public string? ImageURL { get; set; }
        public string? Info { get; set; }
        public string? ICO { get; set; }
        public bool isVerified { get; set; }
    }
}
