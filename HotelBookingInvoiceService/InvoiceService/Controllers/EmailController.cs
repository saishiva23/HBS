using InvoiceService.Models;
using InvoiceService.Services;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            try
            {
                _logger.LogInformation($"Sending email to: {request.To}");

                await _emailService.SendGenericEmailAsync(request.To, request.Subject, request.HtmlBody);

                return Ok(new { message = "Email sent successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to: {request.To}");
                return StatusCode(500, new { error = "Failed to send email", details = ex.Message });
            }
        }
    }
}
