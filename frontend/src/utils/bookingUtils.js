export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut || checkIn === "Not selected" || checkOut === "Not selected") {
    return 1;
  }

  const currentYear = new Date().getFullYear();

  const parse = (dateStr) => {
    if (!dateStr) return null;
    let s = String(dateStr).trim();

    // Check for "25 Jan" format
    const parts = s.split(' ');
    if (parts.length === 2 && !isNaN(parseInt(parts[0]))) {
      // Re-order to "Jan 25, 2026" for better cross-browser compatibility
      return new Date(`${parts[1]} ${parts[0]}, ${currentYear}`);
    }

    // Check if it already has the year
    if (!s.includes(String(currentYear)) && s.length <= 10) {
      s = `${s} ${currentYear}`;
    }

    return new Date(s);
  };

  const start = parse(checkIn);
  const end = parse(checkOut);

  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 1;
  }

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 1;
};

export const currency = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(v);

/**
 * Ensures a price doesn't exceed the absolute maximum of 5000.
 * @param {string} hotelName 
 * @param {number} targetPrice 
 */
export const getCappedPrice = (hotelName, targetPrice) => {
  const MAX_ALLOWED = 5000;

  if (targetPrice > MAX_ALLOWED) {
    return MAX_ALLOWED;
  }
  return targetPrice;
};

/**
 * Triggers PDF download for a booking invoice
 * @param {object} booking 
 */
export const downloadInvoice = async (booking) => {
  try {
    const bookingDate = new Date(booking.checkIn);
    const checkoutDate = new Date(booking.checkOut);

    // Map booking object to .NET InvoiceRequest
    const invoiceRequest = {
      guestName: booking.guestDetails?.firstName ? `${booking.guestDetails.firstName} ${booking.guestDetails.lastName}` : "Guest",
      hotelName: booking.hotel || "Hotel Name",
      roomType: booking.roomType || "Standard Room",
      checkInDate: bookingDate.toISOString(),
      checkOutDate: checkoutDate.toISOString(),
      totalPrice: booking.price || 0,
      totalPrice: booking.price || 0,
      bookingReference: booking.id ? `HB-${booking.id}` : "REF-000",
      guestEmail: booking.guestDetails?.email || ""
    };

    const response = await fetch('http://localhost:5000/api/invoice/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceRequest),
    });

    if (!response.ok) {
      throw new Error('Failed to generate invoice');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${invoiceRequest.bookingReference}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

  } catch (error) {
    console.error('Error downloading invoice:', error);
    alert('Failed to download invoice. Please make sure the Invoice Service is running (dotnet run).');
  }
};

/**
 * Triggers invoice generation to send email only (no download)
 * @param {object} booking 
 */
export const sendInvoiceEmail = async (booking) => {
  try {
    const bookingDate = new Date(booking.checkIn);
    const checkoutDate = new Date(booking.checkOut);

    const invoiceRequest = {
      GuestName: booking.guestDetails?.firstName ? `${booking.guestDetails.firstName} ${booking.guestDetails.lastName}` : "Guest",
      HotelName: booking.hotel || "Hotel Name",
      RoomType: booking.roomType || "Standard Room",
      CheckInDate: bookingDate.toISOString(),
      CheckOutDate: checkoutDate.toISOString(),
      TotalPrice: booking.price || 0,
      BookingReference: booking.id ? `HB-${booking.id}` : "REF-000",
      GuestEmail: booking.guestDetails?.email || ""
    };

    // Debug check
    // alert(`Sending invoice email to: ${invoiceRequest.GuestEmail}`);

    await fetch('http://localhost:5000/api/invoice/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceRequest),
    });

    console.log("Invoice email trigger sent successfully");

  } catch (error) {
    console.error('Error triggering invoice email:', error);
  }
};
