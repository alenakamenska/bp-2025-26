namespace bp_api.DTO
{
    public class ProductDTO
    {
        public string? Name { get; set; }
        public string? Info { get; set; }
        public decimal Price { get; set; }
        public string? ImageURL { get; set; }
        public int CategoryId { get; set; }
        public int BusinessId { get; set; }

        public List<TipDTO>? Tips { get; set; }
    }
}
