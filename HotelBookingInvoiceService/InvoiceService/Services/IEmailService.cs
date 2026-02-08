namespace InvoiceService.Services
{
    public interface IEmailService
    {
        Task SendInvoiceEmailAsync(string toEmail, string guestName, byte[] pdfBytes, string bookingReference);
        
        Task SendGenericEmailAsync(string toEmail, string subject, string htmlBody);
    }
}
