import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HeartIcon, MapPinIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import SearchBar from "../components/SearchBar";
import { mockHotels } from "../data/mockData";
import { addToRecentlyViewed } from "../components/RecentlyViewedHotels";


const mockResults = [
  // Rajasthan - Jaipur, Udaipur, Jodhpur
  {
    id: 1,
    name: "Rambagh Palace",
    city: "Jaipur",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1501117716987-c8eab037d85b?w=800&q=60",
    distance: "2.6 km to City centre",
    location: "Civil Lines, Jaipur",
    ratingScore: 9.6,
    ratingText: "Excellent",
    ratingCount: 15715,
    price: 50373,
    originalPrice: 62500,
    meals: "Breakfast included",
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
    roomType: "Deluxe Suite",
  },
  {
    id: 2,
    name: "The Oberoi Udaivilas",
    city: "Udaipur",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=60",
    distance: "3.2 km to City centre",
    location: "Lake Pichola, Udaipur",
    ratingScore: 9.8,
    ratingText: "Exceptional",
    ratingCount: 9876,
    price: 45000,
    originalPrice: 55000,
    meals: "All meals included",
    amenities: ["Free WiFi", "Lake View", "Spa", "Pool"],
    roomType: "Premier Lake View Room",
  },
  {
    id: 3,
    name: "Umaid Bhawan Palace",
    city: "Jodhpur",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=60",
    distance: "4.5 km to City centre",
    location: "Circuit House Road, Jodhpur",
    ratingScore: 9.7,
    ratingText: "Exceptional",
    ratingCount: 8234,
    price: 48000,
    originalPrice: 60000,
    meals: "Breakfast included",
    amenities: ["Free WiFi", "Pool", "Spa", "Garden"],
    roomType: "Heritage Suite",
  },
  // Maharashtra - Mumbai, Pune, Lonavala
  {
    id: 4,
    name: "Taj Lands End",
    city: "Mumbai",
    state: "Maharashtra",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60",
    distance: "5.1 km to City centre",
    location: "Bandra West, Mumbai",
    ratingScore: 9.2,
    ratingText: "Excellent",
    ratingCount: 12340,
    price: 18500,
    originalPrice: 22000,
    meals: "Breakfast included",
    amenities: ["Free WiFi", "Sea View", "Spa", "Restaurant"],
    roomType: "Ocean View Room",
  },
  {
    id: 5,
    name: "JW Marriott Pune",
    city: "Pune",
    state: "Maharashtra",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=60",
    distance: "3.8 km to City centre",
    location: "Senapati Bapat Road, Pune",
    ratingScore: 9.0,
    ratingText: "Excellent",
    ratingCount: 7654,
    price: 12500,
    originalPrice: 15000,
    meals: "Breakfast & Dinner",
    amenities: ["Free WiFi", "Pool", "Gym", "Restaurant"],
    roomType: "Executive Room",
  },
  {
    id: 6,
    name: "The Machan",
    city: "Lonavala",
    state: "Maharashtra",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=60",
    distance: "2.0 km to Hill Station",
    location: "Jambulne, Lonavala",
    ratingScore: 9.4,
    ratingText: "Exceptional",
    ratingCount: 4532,
    price: 25000,
    originalPrice: 30000,
    meals: "All meals included",
    amenities: ["Tree House", "Nature View", "Private Deck", "Restaurant"],
    roomType: "Canopy Machan",
  },
  // Goa - Panaji, Calangute, Candolim
  {
    id: 7,
    name: "Cidade de Goa",
    city: "Panaji",
    state: "Goa",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=60",
    distance: "3.5 km to City centre",
    location: "Vainguinim Beach, Panaji",
    ratingScore: 8.8,
    ratingText: "Excellent",
    ratingCount: 6789,
    price: 14000,
    originalPrice: 17500,
    meals: "Breakfast included",
    amenities: ["Free WiFi", "Beach Access", "Pool", "Spa"],
    roomType: "Sea View Room",
  },
  {
    id: 8,
    name: "Taj Fort Aguada Resort",
    city: "Calangute",
    state: "Goa",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=60",
    distance: "1.2 km to Beach",
    location: "Sinquerim, Calangute",
    ratingScore: 9.1,
    ratingText: "Excellent",
    ratingCount: 8976,
    price: 22000,
    originalPrice: 27500,
    meals: "Breakfast & Dinner",
    amenities: ["Free WiFi", "Beach Access", "Pool", "Spa"],
    roomType: "Premium Sea View",
  },
  {
    id: 9,
    name: "Vivanta Goa",
    city: "Candolim",
    state: "Goa",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=60",
    distance: "0.8 km to Beach",
    location: "Candolim Beach Road",
    ratingScore: 8.7,
    ratingText: "Excellent",
    ratingCount: 5432,
    price: 11000,
    originalPrice: 14000,
    meals: "Breakfast included",
    amenities: ["Free WiFi", "Beach Access", "Pool", "Bar"],
    roomType: "Superior Room",
  },
  // Kerala - Kochi, Munnar, Alleppey
  {
    id: 10,
    name: "Brunton Boatyard",
    city: "Kochi",
    state: "Kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=60",
    distance: "2.5 km to City centre",
    location: "Fort Kochi",
    ratingScore: 9.3,
    ratingText: "Exceptional",
    ratingCount: 4567,
    price: 16000,
    originalPrice: 20000,
    meals: "Breakfast included",
    amenities: ["Free WiFi", "Harbour View", "Pool", "Restaurant"],
    roomType: "Heritage Room",
  },
  {
    id: 11,
    name: "Spice Village",
    city: "Munnar",
    state: "Kerala",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=60",
    distance: "5.0 km to Town centre",
    location: "Tea Gardens, Munnar",
    ratingScore: 9.5,
    ratingText: "Exceptional",
    ratingCount: 3456,
    price: 18000,
    originalPrice: 22000,
    meals: "All meals included",
    amenities: ["Free WiFi", "Mountain View", "Spa", "Trekking"],
    roomType: "Cottage Suite",
  },
  {
    id: 12,
    name: "Kumarakom Lake Resort",
    city: "Alleppey",
    state: "Kerala",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc32?w=800&q=60",
    distance: "1.0 km to Lake",
    location: "Kumarakom, Alleppey",
    ratingScore: 9.6,
    ratingText: "Exceptional",
    ratingCount: 5678,
    price: 24000,
    originalPrice: 30000,
    meals: "Breakfast & Dinner",
    amenities: ["Free WiFi", "Lake View", "Pool", "Ayurveda Spa"],
    roomType: "Lake Villa",
  },
  // Karnataka - Bangalore, Mysore, Coorg
  {
    id: 13,
    name: "The Leela Palace Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1600100397608-6a6d32b585f9?w=800&q=60",
    distance: "6.0 km to City centre",
    location: "Old Airport Road, Bangalore",
    ratingScore: 9.4,
    ratingText: "Exceptional",
    ratingCount: 9876,
    price: 22000,
    originalPrice: 27500,
    meals: "Breakfast included",
    amenities: ["Free WiFi", "Pool", "Spa", "Golf Course"],
    roomType: "Royal Premier Room",
  },
  {
    id: 14,
    name: "Radisson Blu Mysore",
    city: "Mysore",
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=60",
    distance: "3.2 km to Palace",
    location: "Lalitha Mahal Road, Mysore",
    ratingScore: 8.8,
    ratingText: "Excellent",
    ratingCount: 4567,
    price: 8500,
    originalPrice: 10500,
    meals: "Breakfast included",
    amenities: ["Free WiFi", "Pool", "Gym", "Restaurant"],
    roomType: "Superior Room",
  },
  {
    id: 15,
    name: "Tamara Coorg",
    city: "Coorg",
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=60",
    distance: "8.0 km to Town",
    location: "Napoklu, Coorg",
    ratingScore: 9.7,
    ratingText: "Exceptional",
    ratingCount: 3234,
    price: 35000,
    originalPrice: 42000,
    meals: "All meals included",
    amenities: ["Free WiFi", "Valley View", "Spa", "Nature Trails"],
    roomType: "Luxury Cottage",
  },
  // Tamil Nadu - Chennai, Ooty, Pondicherry
  {
    id: 16,
    name: "ITC Grand Chola",
    city: "Chennai",
    state: "Tamil Nadu",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=60",
    distance: "4.5 km to City centre",
    location: "Guindy, Chennai",
    ratingScore: 9.5,
    ratingText: "Exceptional",
    ratingCount: 11234,
    price: 19000,
    originalPrice: 24000,
    meals: "Breakfast included",
    amenities: ["Free WiFi", "Pool", "Spa", "Multiple Restaurants"],
    roomType: "Towers Room",
  },
  {
    id: 17,
    name: "Savoy - IHCL",
    city: "Ooty",
    state: "Tamil Nadu",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=60",
    distance: "2.0 km to Lake",
    location: "Sylks Road, Ooty",
    ratingScore: 9.2,
    ratingText: "Excellent",
    ratingCount: 4321,
    price: 15000,
    originalPrice: 18500,
    meals: "Breakfast & Dinner",
    amenities: ["Free WiFi", "Garden View", "Heritage", "Restaurant"],
    roomType: "Heritage Suite",
  },
  {
    id: 18,
    name: "Palais de Mahe",
    city: "Pondicherry",
    state: "Tamil Nadu",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=60",
    distance: "1.5 km to Beach",
    location: "White Town, Pondicherry",
    ratingScore: 9.0,
    ratingText: "Excellent",
    ratingCount: 3456,
    price: 12000,
    originalPrice: 15000,
    meals: "Breakfast included",
    amenities: ["Free WiFi", "Pool", "French Heritage", "Rooftop"],
    roomType: "Heritage Room",
  },
];

const currency = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

const useQuery = () => {
  const [params] = useSearchParams();
  return params;
};

const FilterChip = ({ children, active }) => (
  <button className={`px-3 py-2 border dark:border-gray-700 rounded-full text-sm transition ${active
      ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
      : 'bg-white dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`}>
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
  const q = useQuery();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const initialValues = {
    destination: q.get("destination") || "",
    adults: q.get("adults"),
    children: q.get("children"),
    rooms: q.get("rooms"),
    start: q.get("start"),
    end: q.get("end"),
    pets: q.get("pets"),
  };

  const destination = initialValues.destination.toLowerCase().trim();

  // Filter results by city or state name - using mockHotels from data file
  const filteredResults = destination
    ? mockHotels.filter(
      (hotel) =>
        hotel.city.toLowerCase().includes(destination) ||
        hotel.state.toLowerCase().includes(destination)
    )
    : mockHotels;

  const handleAddToCart = (hotel) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Add to recently viewed
    addToRecentlyViewed(hotel.id);

    // Create booking details
    const bookingDetails = {
      hotel: hotel.name,
      roomType: hotel.roomType,
      price: hotel.price,
      checkIn: initialValues.start || "Not selected",
      checkOut: initialValues.end || "Not selected",
      guests: initialValues.adults || "2",
      rooms: initialValues.rooms || "1",
    };

    // Store in localStorage for now (can be upgraded to context/Redux later)
    const existingCart = JSON.parse(localStorage.getItem("hotelCart") || "[]");
    existingCart.push(bookingDetails);
    localStorage.setItem("hotelCart", JSON.stringify(existingCart));

    // Dispatch custom event to update navbar cart count
    window.dispatchEvent(new Event("cartUpdated"));

    alert(`${hotel.name} added to cart!\n\nRoom: ${hotel.roomType}\nPrice: ₹${hotel.price.toLocaleString()} per night`);
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8">
      <div className="mb-8 -mt-10">
        <SearchBar initialValues={initialValues} />
      </div>

      {filteredResults.length === 0 ? (
        /* No city found state */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-6 transition-colors">
            <svg
              className="w-16 h-16 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 transition-colors">No city found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md transition-colors">
            We couldn't find any hotels in "{initialValues.destination}". Try searching for a different city or state.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sort by</span>
              <FilterChip active>Recommend...</FilterChip>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <FilterChip>Filters</FilterChip>
              <FilterChip>Price</FilterChip>
              <FilterChip>Location</FilterChip>
              <FilterChip>Rating: 8.0+</FilterChip>
              <FilterChip>Near city centre</FilterChip>
              <FilterChip>Meals included</FilterChip>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
            We found <span className="font-bold dark:text-white">{filteredResults.length}</span> hotel{filteredResults.length !== 1 ? 's' : ''} in <span className="font-bold dark:text-white">{initialValues.destination || 'your search'}</span>
          </p>

          <div className="space-y-4">
            {filteredResults.map((r) => (
              <ResultCard key={r.id} item={r} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;

