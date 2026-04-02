using Microsoft.AspNetCore.Identity;

namespace bp_api.Models
{
    public class User: IdentityUser
    {
        public ICollection<Business> Businesses { get; set; }
        public DateTime PrivacyPolicyAcceptedAt { get; set; }
    }
}
