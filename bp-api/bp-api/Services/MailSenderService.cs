using System.Net.Http.Json;
using System.Text;

namespace bp_api.Services
{
    public class MailSenderService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient; 

        public MailSenderService(IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        public async Task SendResetEmailAsync(string userEmail, string resetLink)
        {
            string apiKey = _configuration["EmailSettings:SmtpPass"];
            string senderEmail = _configuration["EmailSettings:SenderEmail"];

            var emailData = new
            {
                sender = new { name = "Zahradnictví", email = senderEmail },
                to = new[] { new { email = userEmail } },
                subject = "Reset hesla",
                htmlContent = $@"
                <html>
                    <body style='font-family: sans-serif;'>
                        <h2 style='color: #283618;'>Žádost o obnovu hesla</h2>
                        <p>Dobrý den, klikněte na odkaz níže pro nastavení nového hesla:</p>
                        <p><a href='{resetLink}' style='color: #bc6c25; font-weight: bold;'>Nastavit nové heslo</a></p>
                        <p>Odkaz: {resetLink}</p>
                    </body>
                </html>"
            };

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("api-key", apiKey);

            try
            {
                Console.WriteLine($"--- POKUS O ODESLÁNÍ PŘES API PRO: {userEmail} ---");
                var response = await _httpClient.PostAsJsonAsync("https://api.brevo.com/v3/smtp/email", emailData);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Email úspěšně odeslán přes Brevo API");
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Chyba Brevo API: {response.StatusCode} - {error}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Kritická chyba při volání API: " + ex.Message);
            }
        }
    }
}