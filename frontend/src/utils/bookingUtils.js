import { mockHotels } from "../data/mockData";

export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut || checkIn === "Not selected" || checkOut === "Not selected") {
    return 1;
  }
  
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 1;
  }
  
  const diffTime = end - start;
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
 * Ensures a price doesn't exceed the mock reference price by more than 5000.
 * @param {string} hotelName 
 * @param {number} targetPrice 
 */
export const getCappedPrice = (hotelName, targetPrice) => {
  const hotel = mockHotels.find(h => h.name === hotelName);
  const referencePrice = hotel ? hotel.price : targetPrice;
  const maxAllowed = referencePrice + 5000;
  
  if (targetPrice > maxAllowed) {
    return maxAllowed;
  }
  return targetPrice;
};
