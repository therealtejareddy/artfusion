using System.Net.Mail;
using System.Net;

namespace ArtFusion.Services
{
    public class EmailService : IEmailService
    {
        public Task SendEmailAsync(string email, string subject, string message, List<string> ccList)
        {
            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                EnableSsl = true,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential("mtejareddy1435@gmail.com", "wgnrfrhpvhyndyaw")
            };
            MailMessage mailMessage = new MailMessage(from: "mtejareddy1435@gmail.com",
                                to: email,
                                subject,
                                message
                                );
            mailMessage.IsBodyHtml = true;
            foreach(string cc in ccList )
            {
                mailMessage.Bcc.Add(cc);
            }
            return client.SendMailAsync(mailMessage);
        }
    }
}
