namespace ArtFusion.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string email, string subject, string message, List<string> ccList);
    }
}
