using InvoiceService.Settings;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace InvoiceService.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task SendInvoiceEmailAsync(string toEmail, string guestName, byte[] pdfBytes, string bookingReference)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
                email.To.Add(new MailboxAddress(guestName, toEmail));
                email.Bcc.Add(new MailboxAddress("Admin", _emailSettings.SenderEmail));
                email.Subject = $"Booking Confirmed! - Ref: {bookingReference}";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <h2>Booking Confirmed!</h2>
                        <p>Dear {guestName},</p>
                        <p>Thank you for booking with us!</p>
                        <p>Please find your invoice attached.</p>
                        <p>We look forward to hosting you!</p>
                        <br>
                        <p>Best Regards,</p>
                        <p>{_emailSettings.SenderName}</p>"
                };

                bodyBuilder.Attachments.Add($"Invoice_{bookingReference}.pdf", pdfBytes, ContentType.Parse("application/pdf"));

                email.Body = bodyBuilder.ToMessageBody();

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                _logger.LogInformation($"Invoice email sent successfully to {toEmail} for booking {bookingReference}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send invoice email to {toEmail} for booking {bookingReference}");
                // We do not throw here to allow the controller to still return the PDF to the user
            }
        }
    }
}
