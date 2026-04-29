using System.Net;
using System.Net.Mail;
using System.Text;

namespace bp_api.Services
{
    public class MailSenderService
    {
        private readonly IConfiguration _configuration;

        public MailSenderService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendResetEmailAsync(string userEmail, string resetLink)
        {
            string Username = _configuration["EmailSettings:SmtpUser"]; 
            string Password = _configuration["EmailSettings:SmtpPass"]; 
            string sender = _configuration["EmailSettings:SenderEmail"]; 
            string recipient = userEmail;

            MailMessage message = new MailMessage(sender, recipient);
            message.Subject = "Reset hesla";
            message.SubjectEncoding = Encoding.UTF8;

            string zprava = $@"
                <html>
                    <body style='font-family: sans-serif;'>
                        <h2 style='color: #283618;'>Žádost o obnovu hesla</h2>
                        <p>Dobrý den,</p>
                        <p>obdrželi jsme žádost o resetování hesla k vašemu účtu v aplikaci <strong>Zahradnictví</strong>.</p>
                        <p>Pro nastavení nového hesla klikněte na odkaz níže:</p>
                        <p><a href='{resetLink}' style='color: #bc6c25; font-weight: bold; font-size: 1.1rem; text-decoration: none;'>Nastavit nové heslo</a></p>
                        <br>
                        <p>Pokud tlačítko nefunguje, zkopírujte tento odkaz do prohlížeče:<br>{resetLink}</p>
                        <hr />
                        <p><small>Tento e-mail byl vygenerován automaticky, neodpovídejte na něj.</small></p>
                    </body>
                </html>";

            message.IsBodyHtml = true;
            message.Body = zprava;
            message.BodyEncoding = Encoding.UTF8;

            using SmtpClient smtpClient = new SmtpClient("smtp-relay.brevo.com", 587);
            smtpClient.EnableSsl = true;
            smtpClient.Credentials = new NetworkCredential(Username, Password);

            smtpClient.Timeout = 10000; 

            try
            {
                Console.WriteLine($"--- RESET LINK PRO {recipient}: {resetLink} ---");

                await smtpClient.SendMailAsync(message);
                Console.WriteLine("Email úspěšně odeslán přes Brevo SMTP");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Chyba odesílání mailu: " + ex.Message);
            }
        }
    }
}