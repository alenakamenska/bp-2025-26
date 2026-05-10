namespace bp_api.DTO
{
    public class TipUpdateDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Info { get; set; }
        public int? ProductId { get; set; }
        public int? CategoryId { get; set; }
        public string? UserId { get; set; } 
    }
}
