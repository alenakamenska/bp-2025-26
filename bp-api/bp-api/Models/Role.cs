using Microsoft.AspNetCore.Identity;

namespace bp_api.Models
{
    public class Role: IdentityRole<string>
    {
        public ICollection<User>? Users { get; set; }
    }
}
