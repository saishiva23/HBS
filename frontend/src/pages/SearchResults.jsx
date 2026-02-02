import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HeartIcon, MapPinIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import SearchBar from "../components/SearchBar";
import { addToRecentlyViewed } from "../components/RecentlyViewedHotels";
import { calculateNights, currency } from "../utils/bookingUtils";
import customerAPI from "../services/customerAPI";

const SortChip = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 border dark:border-gray-700 rounded-full text-sm transition font-medium ${active
      ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
  >
    {children}
  </button>
);

const ResultCard = ({ item, onAddToCart, nights = 1, rooms = 1 }) => {
  const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
  const totalPrice = item.price * nights * rooms;
  const totalOriginal = item.originalPrice * nights * rooms;

  const navigate = useNavigate();

  const handleCardClick = () => {
    // Track hotel view
    if (window.localStorage.getItem('token')) {
      addToRecentlyViewed(item.id);
    }
    // Navigate to hotel details page
    navigate(`/hotel/${item.id}`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-4 flex gap-4 hover:shadow-md transition-colors cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img src={item.image} alt={item.name} className="w-52 h-40 object-cover rounded-lg" />
        <button
          className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <HeartIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400" />
        </button>
        {discount > 0 && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
            {discount}% OFF
          </span>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold dark:text-white">{item.name}</h3>
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm mt-1">
              <MapPinIcon className="h-4 w-4" />
              <span>{item.location}</span>
              <span className="mx-1">•</span>
              <span>{item.distance}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{item.roomType}</p>

            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-1 bg-green-600 text-white rounded-md text-sm font-bold">
                {item.ratingScore}
              </span>
              <span className="font-semibold dark:text-white">{item.ratingText}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">({item.ratingCount.toLocaleString()} ratings)</span>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {item.amenities.slice(0, 4).map((amenity) => (
                <span key={amenity} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 w-48 text-right ml-4 transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 line-through">{currency(totalOriginal)}</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{currency(totalPrice)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {nights > 1 || rooms > 1 ? `Total stay (${nights} nights, ${rooms} rooms)` : 'per night + taxes'}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                onAddToCart(item);
              }}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              <ShoppingCartIcon className="h-4 w-4" />
              View Rooms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // State for sorting only
  const [sortBy, setSortBy] = useState("Recommended");
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  const initialValues = useMemo(() => ({
    destination: searchParams.get("destination") || "",
    adults: searchParams.get("adults"),
    children: searchParams.get("children"),
    rooms: searchParams.get("rooms"),
    start: searchParams.get("start"),
    end: searchParams.get("end"),
  }), [searchParams]);

  const destination = initialValues.destination.toLowerCase().trim();

  // State for search results
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter and sort results
  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        let results = [];
        // If destination is provided, search, otherwise get all or popular
        if (initialValues.destination) {
          const data = await customerAPI.searchPage.searchWithFilters({
            city: initialValues.destination,
            destination: initialValues.destination
          });
          results = data;
        } else {
          // If no destination, maybe show all (or handle empty state)
          // For now, let's fetch all or handle appropriately
          const data = await customerAPI.hotels.getAll(); // strict backend integration
          results = data;
        }

        // Map backend data to frontend format
        const mappedResults = results.map(hotel => {
          let parsedImages = [];
          try {
            if (hotel.images) {
              parsedImages = typeof hotel.images === 'string' ? JSON.parse(hotel.images) : hotel.images;
              // Ensure it's an array and not null
              if (!Array.isArray(parsedImages)) {
                parsedImages = [parsedImages];
              }
            }
          } catch (e) {
            parsedImages = hotel.images ? [hotel.images] : [];
          }

          // Ensure parsedImages is always an array
          if (!parsedImages || !Array.isArray(parsedImages) || parsedImages.length === 0) {
            parsedImages = ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60'];
          }

          const parsedAmenities = [];
          if (hotel.wifi) parsedAmenities.push("WiFi");
          if (hotel.parking) parsedAmenities.push("Parking");
          if (hotel.gym) parsedAmenities.push("Gym");
          if (hotel.ac) parsedAmenities.push("AC");
          if (hotel.restaurant) parsedAmenities.push("Restaurant");
          if (hotel.roomService) parsedAmenities.push("Room Service");

          // Extract price number from priceRange string if possible, else default
          let priceVal = 5000;
          if (hotel.priceRange) {
            const match = hotel.priceRange.match(/(\d+)/);
            if (match) priceVal = parseInt(match[0]);
          }

          return {
            id: hotel.id,
            name: hotel.name,
            city: hotel.city,
            state: hotel.state,
            image: parsedImages[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60',
            distance: hotel.distance || "Near City Center",
            location: hotel.location || `${hotel.city}, ${hotel.state}`,
            ratingScore: hotel.rating || 0,
            ratingText: hotel.ratingText || "Good",
            ratingCount: hotel.ratingCount || 0,
            price: priceVal,
            originalPrice: priceVal, // Backend doesn't have orig price
            amenities: parsedAmenities,
            roomType: "Standard Room", // Backend hotel entity doesn't list specific room types in search
          };
        });

        // 2. Apply sorting (Frontend side for now)
        const sorted = [...mappedResults].sort((a, b) => {
          if (sortBy === "Price: Low to High") return a.price - b.price;
          if (sortBy === "Price: High to Low") return b.price - a.price;
          if (sortBy === "Top Rated") return b.ratingScore - a.ratingScore;
          return 0; // Recommended
        });

        setSearchResults(sorted);

      } catch (error) {
        console.error("Error searching hotels:", error);
        toast.error(`Search failed: ${error.message || "Unknown error"}`);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [initialValues.destination, sortBy]); // Re-run when destination or sort changes

  const toggleFavorite = (hotel) => {
    // Check authentication before allowing favorites
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      navigate('/login');
      return;
    }

    const isFavorited = favorites.some(f => f.id === hotel.id);

    let updatedFavorites;
    if (isFavorited) {
      updatedFavorites = favorites.filter(f => f.id !== hotel.id);
      toast.success(`${hotel.name} removed from favorites`);
    } else {
      updatedFavorites = [...favorites, hotel];
      toast.success(`${hotel.name} added to favorites`);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleAddToCart = (hotel) => {
    if (!isAuthenticated) {
      toast.error("Please login to book a hotel");
      navigate("/login");
      return;
    }

    addToRecentlyViewed(hotel.id);

    // Navigate to hotel details to select a specific room type
    // Search results don't have room type information needed for booking
    toast.success(`Viewing ${hotel.name} - Select a room to book`);
    navigate(`/hotel/${hotel.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
      <div className="mb-8">
        <SearchBar initialValues={initialValues} />
      </div>

      {!isLoading && searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-6 transition-colors">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No results found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            We couldn't find any hotels matching your search. Try a different destination.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sort by</span>
              <SortChip
                active={sortBy === "Recommended"}
                onClick={() => setSortBy("Recommended")}
              >
                Recommended
              </SortChip>
              <SortChip
                active={sortBy.startsWith("Price")}
                onClick={() => setSortBy(sortBy === "Price: Low to High" ? "Price: High to Low" : "Price: Low to High")}
              >
                Price {sortBy === "Price: Low to High" ? "↑" : sortBy === "Price: High to Low" ? "↓" : ""}
              </SortChip>
              <SortChip
                active={sortBy === "Top Rated"}
                onClick={() => setSortBy("Top Rated")}
              >
                Top Rated
              </SortChip>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
            We found <span className="font-bold dark:text-white">{searchResults.length}</span> hotel{searchResults.length !== 1 ? 's' : ''} in <span className="font-bold dark:text-white">{initialValues.destination || 'your search'}</span>
          </p>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
            ) : (
              searchResults.map((hotel) => (
                <ResultCard
                  key={hotel.id}
                  item={hotel}
                  onAddToCart={handleAddToCart}
                  nights={calculateNights(initialValues.start, initialValues.end)}
                  rooms={parseInt(initialValues.rooms || "1")}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;

