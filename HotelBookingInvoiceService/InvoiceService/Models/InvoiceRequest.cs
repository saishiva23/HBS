namespace InvoiceService.Models
{
    public class InvoiceRequest
    {
        public string GuestName { get; set; } = string.Empty;
        public string HotelName { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string BookingReference { get; set; } = string.Empty;
        public string? GuestEmail { get; set; }
    }
}
