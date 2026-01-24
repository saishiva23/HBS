import { useState, useEffect, useRef } from "react";
import { ChevronRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { getHotelById } from "../data/mockData";
import { useReviews } from "../context/ReviewsContext";
import { FaStar } from "react-icons/fa";

const currency = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);

const HotelCard = ({ hotel, onClick, userRating }) => {
  const discount = Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100);
  
  return (
    <button
      onClick={onClick}
      className="text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden min-w-[280px] hover:shadow-md transition-all group"
    >
      <div className="relative overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded shadow-lg">
            {discount}% OFF
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg truncate dark:text-white group-hover:text-blue-600 transition-colors">{hotel.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{hotel.city}, {hotel.state}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-0.5 bg-green-600 text-white rounded text-xs font-bold">
            {userRating ? userRating.score : hotel.ratingScore}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {userRating ? userRating.text : hotel.ratingText}
          </span>
          {userRating && (
            <span className="flex items-center gap-1 text-xs text-yellow-500">
              <FaStar className="h-3 w-3" />
              {userRating.count} review{userRating.count !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-gray-400 text-sm line-through">{currency(hotel.originalPrice)}</span>
          <span className="font-bold text-lg dark:text-white">{currency(hotel.price)}</span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">/night</span>
        </div>
      </div>
    </button>
  );
};


const RecentlyViewedHotels = () => {
  const [recentHotels, setRecentHotels] = useState([]);
  const scrollerRef = useRef(null);
  const navigate = useNavigate();
  const { getHotelRating } = useReviews();

  useEffect(() => {
    const loadRecentlyViewed = () => {
      const recentIds = JSON.parse(localStorage.getItem("recentlyViewedHotels") || "[]");
      const hotels = recentIds
        .map((id) => getHotelById(id))
        .filter(Boolean)
        .slice(0, 10); // Show max 10 recently viewed
      setRecentHotels(hotels);
    };

    loadRecentlyViewed();

    // Listen for updates
    window.addEventListener("hotelViewed", loadRecentlyViewed);
    window.addEventListener("storage", loadRecentlyViewed);
    window.addEventListener("reviewAdded", loadRecentlyViewed);

    return () => {
      window.removeEventListener("hotelViewed", loadRecentlyViewed);
      window.removeEventListener("storage", loadRecentlyViewed);
      window.removeEventListener("reviewAdded", loadRecentlyViewed);
    };
  }, []);

  const scrollRight = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleHotelClick = (hotel) => {
    // Navigate to search with the city
    navigate(`/search?destination=${encodeURIComponent(hotel.city)}&adults=2&rooms=1`);
  };

  // Don't render if no recently viewed hotels
  if (recentHotels.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold dark:text-white">Recently viewed</h2>
      </div>
      
      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto pb-2 pr-10 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recentHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onClick={() => handleHotelClick(hotel)}
              userRating={getHotelRating(hotel.id)}
            />
          ))}
        </div>

        {recentHotels.length > 3 && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRightIcon className="h-5 w-5 dark:text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

// Helper function to add a hotel to recently viewed
export const addToRecentlyViewed = (hotelId) => {
  const recentIds = JSON.parse(localStorage.getItem("recentlyViewedHotels") || "[]");
  
  // Remove if already exists (to move to front)
  const filtered = recentIds.filter((id) => id !== hotelId);
  
  // Add to front
  filtered.unshift(hotelId);
  
  // Keep only last 10
  const limited = filtered.slice(0, 10);
  
  localStorage.setItem("recentlyViewedHotels", JSON.stringify(limited));
  
  // Dispatch event to update UI
  window.dispatchEvent(new Event("hotelViewed"));
};

export default RecentlyViewedHotels;
