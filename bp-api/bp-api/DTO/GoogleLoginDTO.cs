using System.Text.Json.Serialization;

namespace bp_api.DTO
{
    public class GoogleLoginDTO
    {
        [JsonPropertyName("idToken")]
        public string IdToken { get; set; } = null!;

        [JsonPropertyName("selectedRole")]
        public string? SelectedRole { get; set; }
    }
}
