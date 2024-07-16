using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Options;
using MailKit.Security;
public class SmtpSettings
{
    public string Server { get; set; }
    public int Port { get; set; }
    public string SenderName { get; set; }
    public string SenderEmail { get; set; }
    public string Password { get; set; }
}
public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string message);
}

public class EmailService : IEmailService
{
    private readonly SmtpSettings _smtpSettings;

    public EmailService(IOptions<SmtpSettings> smtpSettings)
    {
        _smtpSettings = smtpSettings.Value;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_smtpSettings.SenderName, _smtpSettings.SenderEmail));
        email.To.Add(new MailboxAddress(toEmail, toEmail));
        email.Subject = subject;

        var bodyBuilder = new BodyBuilder { HtmlBody = message };
        email.Body = bodyBuilder.ToMessageBody();

        using (var client = new SmtpClient())
        {
            try
            {
                await client.ConnectAsync(_smtpSettings.Server, _smtpSettings.Port, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_smtpSettings.SenderEmail, _smtpSettings.Password);
                await client.SendAsync(email);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                throw;
            }
        }
    }
}
