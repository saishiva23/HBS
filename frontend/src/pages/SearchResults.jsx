import { Link, useSearchParams } from "react-router-dom";
import { HeartIcon, MapPinIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import SearchBar from "../components/SearchBar";

const mockResults = [
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
    name: "The LaLit Jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=60",
    distance: "8.2 km to City centre",
    location: "Jagatpura, Jaipur",
    ratingScore: 8.7,
    ratingText: "Excellent",
    ratingCount: 8421,
    price: 4720,
    originalPrice: 5900,
    meals: "Breakfast & Dinner",
    amenities: ["Free WiFi", "Pool", "Gym", "Parking"],
    roomType: "Superior Room",
  },
  {
    id: 3,
    name: "Taj Lands End",
    city: "Mumbai",
    state: "Maharashtra",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=60",
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
    id: 4,
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
    id: 5,
    name: "Taj Holiday Village",
    city: "Goa",
    state: "Goa",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=60",
    distance: "1.5 km to Beach",
    location: "Candolim Beach, Goa",
    ratingScore: 8.9,
    ratingText: "Excellent",
    ratingCount: 7650,
    price: 12000,
    originalPrice: 15000,
    meals: "Breakfast included",
    amenities: ["Free WiFi", "Beach Access", "Pool", "Bar"],
    roomType: "Garden View Cottage",
  },
  {
    id: 6,
    name: "The Leela Palace",
    city: "Delhi",
    state: "Delhi",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60",
    distance: "4.0 km to City centre",
    location: "Chanakyapuri, New Delhi",
    ratingScore: 9.5,
    ratingText: "Exceptional",
    ratingCount: 11200,
    price: 28000,
    originalPrice: 35000,
    meals: "Breakfast & Lunch",
    amenities: ["Free WiFi", "Spa", "Pool", "Concierge"],
    roomType: "Royal Premier Room",
  },
];

const currency = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

const useQuery = () => {
  const [params] = useSearchParams();
  return params;
};

const FilterChip = ({ children, active }) => (
  <button className={`px-3 py-2 border rounded-full text-sm transition ${active ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}`}>
    {children}
  </button>
);

const ResultCard = ({ item, onAddToCart }) => {
  const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
  
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 flex gap-4 hover:shadow-md transition">
      <div className="relative">
        <img src={item.image} alt={item.name} className="w-52 h-40 object-cover rounded-lg" />
        <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-gray-100">
          <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
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
              <h3 className="text-xl font-bold">{item.name}</h3>
            </div>
            <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
              <MapPinIcon className="h-4 w-4" />
              <span>{item.location}</span>
              <span className="mx-1">•</span>
              <span>{item.distance}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{item.roomType}</p>
            
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-1 bg-green-600 text-white rounded-md text-sm font-bold">
                {item.ratingScore}
              </span>
              <span className="font-semibold">{item.ratingText}</span>
              <span className="text-gray-500 text-sm">({item.ratingCount.toLocaleString()} ratings)</span>
            </div>
            
            <div className="mt-2 flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">{item.meals}</span>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {item.amenities.slice(0, 4).map((amenity) => (
                <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 w-48 text-right ml-4">
            <p className="text-sm text-gray-500 line-through">{currency(item.originalPrice)}</p>
            <p className="text-2xl font-extrabold text-gray-900">{currency(item.price)}</p>
            <p className="text-xs text-gray-500 mt-1">per night + taxes</p>
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
  
  // Filter results by city or state name
  const filteredResults = destination
    ? mockResults.filter(
        (hotel) =>
          hotel.city.toLowerCase().includes(destination) ||
          hotel.state.toLowerCase().includes(destination)
      )
    : mockResults;

  const handleAddToCart = (hotel) => {
    // For now, show an alert. Later this can be connected to a cart context/state
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
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-gray-100 rounded-full p-6 mb-6">
            <svg
              className="w-16 h-16 text-gray-400"
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No city found</h2>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            We couldn't find any hotels in "{initialValues.destination}". Try searching for a different city or state.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by</span>
              <FilterChip>Recommend...</FilterChip>
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

          <p className="text-sm text-gray-600 mb-4">
            We found {filteredResults.length} hotel{filteredResults.length !== 1 ? 's' : ''} in {initialValues.destination || 'your search'}
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

