import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HeartIcon, MapPinIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import SearchBar from "../components/SearchBar";
import { mockHotels } from "../data/mockData";
import { addToRecentlyViewed } from "../components/RecentlyViewedHotels";



import { calculateNights, currency, getCappedPrice } from "../utils/bookingUtils";

const parseKm = (distanceText) => {
  if (!distanceText) return null;
  const match = String(distanceText).match(/([\d.]+)\s*km/i);
  return match ? Number(match[1]) : null;
};

const FilterChip = ({ children, active, onClick }) => (
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

const ResultCard = ({ item, onAddToCart }) => {
  const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-4 flex gap-4 hover:shadow-md transition-colors">
      <div className="relative">
        <img src={item.image} alt={item.name} className="w-52 h-40 object-cover rounded-lg" />
        <button className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
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

            <div className="mt-2 flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span className="text-sm text-green-700 dark:text-green-400 font-medium">{item.meals}</span>
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
            <p className="text-sm text-gray-500 dark:text-gray-400 line-through">{currency(item.originalPrice)}</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{currency(item.price)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">per night + taxes</p>
            <button
              onClick={() => onAddToCart(item)}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              <ShoppingCartIcon className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // States for sorting and filtering
  const [sortBy, setSortBy] = useState("Recommended");
  const [filterRating, setFilterRating] = useState(() => searchParams.get("rating8") === "true");
  const [filterMeals, setFilterMeals] = useState(() => searchParams.get("meals") === "included");
  const [filterNear, setFilterNear] = useState(() => searchParams.get("near") === "true");
  const [filterPets, setFilterPets] = useState(() => searchParams.get("pets") === "true");

  const setParam = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === null || value === undefined || value === "") next.delete(key);
      else next.set(key, String(value));
      return next;
    });
  }, [setSearchParams]);

  const initialValues = useMemo(() => ({
    destination: searchParams.get("destination") || "",
    adults: searchParams.get("adults"),
    children: searchParams.get("children"),
    rooms: searchParams.get("rooms"),
    start: searchParams.get("start"),
    end: searchParams.get("end"),
    pets: searchParams.get("pets"),
  }), [searchParams]);

  const destination = initialValues.destination.toLowerCase().trim();

  // Filter and Sort results
  const results = useMemo(() => {
    // 1. Filter by destination
    let filtered = destination
      ? mockHotels.filter(
          (hotel) =>
            hotel.city.toLowerCase().includes(destination) ||
            hotel.state.toLowerCase().includes(destination)
        )
      : mockHotels;

    // 2. Apply additional filters
    if (filterRating) {
      filtered = filtered.filter(hotel => hotel.ratingScore >= 8.0);
    }

    if (filterMeals) {
      filtered = filtered.filter((hotel) => {
        const m = String(hotel.meals || "").toLowerCase();
        return m.includes("breakfast") || m.includes("meal") || m.includes("included");
      });
    }

    if (filterNear) {
      filtered = filtered.filter((hotel) => {
        const km = parseKm(hotel.distance);
        return km !== null ? km <= 3 : true;
      });
    }

    if (filterPets) {
      filtered = filtered.filter((hotel) => hotel.petFriendly === true);
    }

    // 3. Apply sorting
    return [...filtered].sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Top Rated") return b.ratingScore - a.ratingScore;
      if (sortBy === "Most Reviews") return b.ratingCount - a.ratingCount;
      return 0; // Recommended
    });
  }, [destination, sortBy, filterRating, filterMeals, filterNear, filterPets]);

  const handleAddToCart = (hotel) => {
    if (!isAuthenticated) {
      toast.error("Please login to book a hotel");
      navigate("/login");
      return;
    }

    addToRecentlyViewed(hotel.id);

    const nights = calculateNights(initialValues.start, initialValues.end);
    const roomsCount = parseInt(initialValues.rooms || "1");
    
    const basePrice = getCappedPrice(hotel.name, hotel.price);
    
    const bookingDetails = {
      hotel: hotel.name,
      roomType: hotel.roomType,
      basePrice: basePrice,
      price: basePrice * roomsCount * nights,
      checkIn: initialValues.start || "Not selected",
      checkOut: initialValues.end || "Not selected",
      guests: initialValues.adults || "2",
      rooms: roomsCount,
      nights: nights,
      image: hotel.image
    };

    const existingCart = JSON.parse(localStorage.getItem("hotelCart") || "[]");
    existingCart.push(bookingDetails);
    localStorage.setItem("hotelCart", JSON.stringify(existingCart));
    
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${hotel.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
      <div className="mb-8">
        <SearchBar initialValues={initialValues} />
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-6 transition-colors">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No results found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            We couldn't find any hotels matching your criteria. Try adjusting your filters or destination.
          </p>
          <button 
            onClick={() => {
              setSortBy("Recommended");
              setFilterRating(false);
              setFilterMeals(false);
              setFilterNear(false);
              setFilterPets(false);
              setParam("rating8", null);
              setParam("meals", null);
              setParam("near", null);
              setParam("pets", initialValues.pets === "true" ? "true" : null);
            }}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sort by</span>
              <FilterChip 
                active={sortBy === "Recommended"} 
                onClick={() => setSortBy("Recommended")}
              >
                Recommended
              </FilterChip>
              <FilterChip 
                active={sortBy.startsWith("Price")} 
                onClick={() => setSortBy(sortBy === "Price: Low to High" ? "Price: High to Low" : "Price: Low to High")}
              >
                Price {sortBy === "Price: Low to High" ? "↑" : sortBy === "Price: High to Low" ? "↓" : ""}
              </FilterChip>
              <FilterChip 
                active={sortBy === "Top Rated"} 
                onClick={() => setSortBy("Top Rated")}
              >
                Top Rated
              </FilterChip>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium ml-2">Filter</span>
              <FilterChip 
                active={filterRating} 
                onClick={() => {
                  const next = !filterRating;
                  setFilterRating(next);
                  setParam("rating8", next ? "true" : null);
                }}
              >
                Rating: 8.0+
              </FilterChip>
              <FilterChip
                active={filterNear}
                onClick={() => {
                  const next = !filterNear;
                  setFilterNear(next);
                  setParam("near", next ? "true" : null);
                }}
              >
                Within 3 km
              </FilterChip>
              <FilterChip
                active={filterMeals}
                onClick={() => {
                  const next = !filterMeals;
                  setFilterMeals(next);
                  setParam("meals", next ? "included" : null);
                }}
              >
                Meals included
              </FilterChip>
              <FilterChip
                active={filterPets}
                onClick={() => {
                  const next = !filterPets;
                  setFilterPets(next);
                  setParam("pets", next ? "true" : null);
                }}
              >
                Pet-friendly
              </FilterChip>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
            We found <span className="font-bold dark:text-white">{results.length}</span> hotel{results.length !== 1 ? 's' : ''} in <span className="font-bold dark:text-white">{initialValues.destination || 'your search'}</span>
          </p>

          <div className="space-y-4">
            {results.map((hotel) => (
              <ResultCard key={hotel.id} item={hotel} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;

