import { useState, useEffect, useRef } from "react";
import { ChevronRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import customerAPI from '../services/customerAPI';
import { useAuth } from '../context/AuthContext';
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
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadRecentlyViewed();
    }

    // Listen for hotel viewed events
    const handleHotelViewed = () => {
      if (isAuthenticated) {
        loadRecentlyViewed();
      }
    };

    window.addEventListener('hotelViewed', handleHotelViewed);
    return () => window.removeEventListener('hotelViewed', handleHotelViewed);
  }, [isAuthenticated]);

  const loadRecentlyViewed = async () => {
    try {
      const hotels = await customerAPI.recentlyViewed.get();

      // Map backend data to frontend format
      const mappedHotels = hotels.map(hotel => {
        // Parse images
        let images = [];
        try {
          images = typeof hotel.images === 'string' ? JSON.parse(hotel.images) : hotel.images || [];
        } catch {
          images = [hotel.images || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60'];
        }

        // Extract price from priceRange string
        let price = 5000; // default
        if (hotel.priceRange) {
          const match = hotel.priceRange.match(/(\d+)/);
          if (match) price = parseInt(match[0]);
        } else if (hotel.price) {
          price = parseInt(hotel.price);
        }

        return {
          id: hotel.id,
          name: hotel.name,
          city: hotel.city,
          state: hotel.state,
          image: images[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60',
          price: price,
          originalPrice: price, // No discount info from backend
          rating: hotel.rating || 4.0,
          ratingText: hotel.ratingText || 'Good',
          ratingCount: hotel.ratingCount || 0,
          ratingScore: hotel.rating || 4.0
        };
      });

      setRecentHotels(mappedHotels.slice(0, 10));
    } catch (error) {
      console.error('Error loading recently viewed hotels:', error);
      // No fallback - show nothing if API fails
      setRecentHotels([]);
    }
  };

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
              userRating={{ score: hotel.rating || 4.0, text: hotel.ratingText || 'Good', count: hotel.ratingCount || 0 }}
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
export const addToRecentlyViewed = async (hotelId) => {
  try {
    await customerAPI.recentlyViewed.add(hotelId);
    // Dispatch event to update UI
    window.dispatchEvent(new Event("hotelViewed"));
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
};

export default RecentlyViewedHotels;
