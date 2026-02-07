using Microsoft.AspNetCore.Mvc;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using InvoiceService.Models;

using InvoiceService.Services;

namespace InvoiceService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public InvoiceController(IEmailService emailService)
        {
            _emailService = emailService;
        }
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateInvoice([FromBody] InvoiceRequest request)
        {
            try
            {
                Console.WriteLine($"[DEBUG] Received Invoice Request for Ref: {request.BookingReference}");
                Console.WriteLine($"[DEBUG] GuestEmail: '{request.GuestEmail}'");
                Console.WriteLine($"[DEBUG] GuestName: '{request.GuestName}'");

                QuestPDF.Settings.License = LicenseType.Community;

                var document = Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(2, Unit.Centimetre);
                        page.PageColor(Colors.White);
                        page.DefaultTextStyle(x => x.FontSize(11));

                        page.Header()
                            .Text($"HOTEL BOOKING INVOICE")
                            .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                        page.Content()
                            .PaddingVertical(1, Unit.Centimetre)
                            .Column(x =>
                            {
                                x.Spacing(15);

                                // Invoice details
                                x.Item().Row(row =>
                                {
                                    row.RelativeItem().Column(col =>
                                    {
                                        col.Item().Text($"Invoice #: {request.BookingReference}").SemiBold();
                                        col.Item().Text($"Date: {DateTime.Now:dd MMM yyyy}");
                                    });
                                });

                                x.Item().LineHorizontal(1).LineColor(Colors.Black);

                                // Guest and hotel info
                                x.Item().Row(row =>
                                {
                                    row.RelativeItem().Column(col =>
                                    {
                                        col.Item().Text("Guest Details").SemiBold().FontSize(12);
                                        col.Item().Text($"Name: {request.GuestName}");
                                    });
                                    row.RelativeItem().Column(col =>
                                    {
                                        col.Item().Text("Hotel Details").SemiBold().FontSize(12);
                                        col.Item().Text($"Hotel: {request.HotelName}");
                                        col.Item().Text($"Room Type: {request.RoomType}");
                                    });
                                });

                                // Stay details
                                x.Item().Column(col =>
                                {
                                    col.Item().Text("Stay Details").SemiBold().FontSize(12);
                                    col.Item().Text($"Check-in: {request.CheckInDate:dd MMM yyyy}");
                                    col.Item().Text($"Check-out: {request.CheckOutDate:dd MMM yyyy}");
                                    var nights = (request.CheckOutDate - request.CheckInDate).Days;
                                    col.Item().Text($"Duration: {nights} night(s)");
                                });

                                x.Item().LineHorizontal(1).LineColor(Colors.Black);

                                // Charges table
                                x.Item().Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.RelativeColumn(3);
                                        columns.RelativeColumn(1);
                                        columns.RelativeColumn(1);
                                        columns.RelativeColumn(1);
                                    });

                                    table.Header(header =>
                                    {
                                        header.Cell().Element(HeaderStyle).Text("Description");
                                        header.Cell().Element(HeaderStyle).AlignCenter().Text("Nights");
                                        header.Cell().Element(HeaderStyle).AlignRight().Text("Rate");
                                        header.Cell().Element(HeaderStyle).AlignRight().Text("Amount");
                                    });

                                    var nights = (request.CheckOutDate - request.CheckInDate).Days;
                                    var ratePerNight = nights > 0 ? request.TotalPrice / nights : request.TotalPrice;

                                    table.Cell().Element(CellStyle).Text($"{request.RoomType} Room");
                                    table.Cell().Element(CellStyle).AlignCenter().Text(nights.ToString());
                                    table.Cell().Element(CellStyle).AlignRight().Text($"₹{ratePerNight:N0}");
                                    table.Cell().Element(CellStyle).AlignRight().Text($"₹{request.TotalPrice:N0}");
                                });

                                x.Item().AlignRight().Text($"Total Amount: ₹{request.TotalPrice:N0}").FontSize(14).SemiBold();

                                x.Item().PaddingTop(20).Text("Thank you for choosing our hotel!").FontSize(10).Italic();
                            });

                        page.Footer()
                            .AlignCenter()
                            .Text($"Generated on {DateTime.Now:dd MMM yyyy HH:mm}").FontSize(8);
                    });
                });

                var pdf = document.GeneratePdf();

                if (!string.IsNullOrEmpty(request.GuestEmail))
                {
                    await _emailService.SendInvoiceEmailAsync(request.GuestEmail, request.GuestName, pdf, request.BookingReference);
                }

                return File(pdf, "application/pdf", $"Invoice_{request.BookingReference}.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        private static IContainer HeaderStyle(IContainer container)
        {
            return container.DefaultTextStyle(x => x.SemiBold())
                           .PaddingVertical(5)
                           .BorderBottom(1)
                           .BorderColor(Colors.Black);
        }

        private static IContainer CellStyle(IContainer container)
        {
            return container.PaddingVertical(5)
                           .BorderBottom(1)
                           .BorderColor(Colors.Black);
        }
    }
}
