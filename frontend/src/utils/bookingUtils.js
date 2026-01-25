import { mockHotels } from "../data/mockData";

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
