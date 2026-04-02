namespace bp_api.Models
{
    public class OpeningHours
    {
        public string Day {  get; set; }
        public int BusinessId { get; set; }
        public Business? Business { get; set; }
        public TimeOnly Start { get; set; }
        public TimeOnly End { get; set; }

        public bool IsClosed { get; set; }
    }
}
