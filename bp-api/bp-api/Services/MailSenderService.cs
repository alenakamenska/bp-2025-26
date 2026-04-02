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
                       <body>
                           <h2>Žádost o obnovu hesla</h2>
                           <p>Dobrý den,</p>
                           <p>obdrželi jsme žádost o resetování hesla k vašemu účtu v aplikaci <strong>Zahradnictví</strong>.</p>
                           <p>Pokud jste o reset nežádali, můžete tento e-mail ignorovat. V opačném případě klikněte na odkaz níže:</p>
                           <p><a href='{resetLink}' style='color: #28a745; font-weight: bold;'>Nastavit nové heslo</a></p>
                            <br>
                            <p>Pokud tlačítko nefunguje, zkopírujte tento odkaz do prohlížeče:<br>{resetLink}</p>
                           <hr />
                           <p><small>Tento e-mail byl vygenerován automaticky, neodpovídejte na něj.</small></p>
                       </body>
                    </html>";

            message.IsBodyHtml = true;
            message.Body = zprava;
            message.BodyEncoding = Encoding.UTF8;

            using SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
            smtpClient.EnableSsl = true;
            smtpClient.Credentials = new NetworkCredential(Username, Password);

            try
            {
                await smtpClient.SendMailAsync(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

        }
    }
}
