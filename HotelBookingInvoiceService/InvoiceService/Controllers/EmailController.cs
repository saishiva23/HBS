using Microsoft.AspNetCore.Mvc;
using InvoiceService.Services;

namespace InvoiceService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<EmailController> _logger;

        public EmailController(IEmailService emailService, ILogger<EmailController> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        /// <summary>
        /// Send invoice email with PDF attachment
        /// </summary>
        [HttpPost("send-invoice")]
        public async Task<IActionResult> SendInvoiceEmail([FromBody] EmailInvoiceRequest request)
        {
            try
            {
                _logger.LogInformation($"Sending invoice email to {request.ToEmail} for booking {request.BookingReference}");

                await _emailService.SendInvoiceEmailAsync(
                    request.ToEmail,
                    request.GuestName,
                    request.PdfBytes,
                    request.BookingReference
                );

                return Ok(new { message = "Email sent successfully", recipient = request.ToEmail });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send invoice email");
                return StatusCode(500, new { error = "Failed to send email", details = ex.Message });
            }
        }

        /// <summary>
        /// Health check endpoint for email service
        /// </summary>
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "Email service is running", timestamp = DateTime.UtcNow });
        }
    }

    // Request model for email endpoint
    public class EmailInvoiceRequest
    {
        public string ToEmail { get; set; } = string.Empty;
        public string GuestName { get; set; } = string.Empty;
        public byte[] PdfBytes { get; set; } = Array.Empty<byte>();
        public string BookingReference { get; set; } = string.Empty;
    }
}
