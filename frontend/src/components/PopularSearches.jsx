import { useState, useRef } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const cities = [
  {
    name: "Jaipur",
    hotels: 4810,
    avg: 4742,
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=60",
  },
  {
    name: "Mumbai",
    hotels: 5130,
    avg: 6935,
    image:
      "https://images.unsplash.com/photo-1548013146-7a3a6b39b0f6?w=800&q=60",
  },
  {
    name: "Udaipur",
    hotels: 2506,
    avg: 5761,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=60",
  },
  {
    name: "Goa",
    hotels: 3200,
    avg: 8500,
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=60",
  },
  {
    name: "Delhi",
    hotels: 6200,
    avg: 5500,
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=60",
  },
];

const destinations = [
  {
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=60",
    cities: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar"],
    totalHotels: 12500,
  },
  {
    state: "Maharashtra",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=60",
    cities: ["Mumbai", "Pune", "Nashik", "Lonavala", "Mahabaleshwar"],
    totalHotels: 15200,
  },
  {
    state: "Goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=60",
    cities: ["Panaji", "Calangute", "Candolim", "Baga", "Anjuna"],
    totalHotels: 8500,
  },
  {
    state: "Kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=60",
    cities: ["Kochi", "Munnar", "Alleppey", "Trivandrum", "Kovalam"],
    totalHotels: 9800,
  },
  {
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1600100397608-6a6d32b585f9?w=800&q=60",
    cities: ["Bangalore", "Mysore", "Hampi", "Coorg", "Mangalore"],
    totalHotels: 11200,
  },
  {
    state: "Tamil Nadu",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=60",
    cities: ["Chennai", "Ooty", "Madurai", "Pondicherry", "Kodaikanal"],
    totalHotels: 10500,
  },
];

const currency = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);

const CityCard = ({ item, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl shadow-sm border overflow-hidden min-w-[260px] hover:shadow-md transition"
    >
      <img
        src={item.image}
        alt={item.name}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <p className="text-lg font-bold">{item.name}</p>
        <p className="text-sm text-gray-600">{item.hotels.toLocaleString()} Hotels</p>
        <p className="text-sm font-semibold">{currency(item.avg)} Avg.</p>
      </div>
    </button>
  );
};

const DestinationCard = ({ item, navigate }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden min-w-[300px]">
      <img
        src={item.image}
        alt={item.state}
        className="h-36 w-full object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">{item.state}</p>
            <p className="text-sm text-gray-600">{item.totalHotels.toLocaleString()} Hotels</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ChevronDownIcon
              className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        {expanded && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-500 mb-2">Popular cities:</p>
            <div className="flex flex-wrap gap-2">
              {item.cities.map((city) => (
                <button
                  key={city}
                  onClick={() =>
                    navigate(`/search?destination=${encodeURIComponent(city)}&adults=2&rooms=1`)
                  }
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PopularSearches = () => {
  const [tab, setTab] = useState("Cities");
  const scrollerRef = useRef(null);
  const navigate = useNavigate();

  const scrollRight = () => {
    if (scrollerRef.current) scrollerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Popular searches</h2>
      <div className="flex gap-6 mb-4">
        <button
          onClick={() => setTab("Cities")}
          className={`font-semibold pb-2 border-b-2 transition ${
            tab === "Cities" ? "text-black border-blue-600" : "text-gray-500 border-transparent"
          }`}
        >
          Cities
        </button>
        <button
          onClick={() => setTab("Destinations")}
          className={`font-semibold pb-2 border-b-2 transition ${
            tab === "Destinations" ? "text-black border-blue-600" : "text-gray-500 border-transparent"
          }`}
        >
          Destinations
        </button>
      </div>
      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto pb-2 pr-10"
          style={{ scrollbarWidth: "none" }}
        >
          {tab === "Cities" &&
            cities.map((c) => (
              <CityCard
                key={c.name}
                item={c}
                onClick={() =>
                  navigate(
                    `/search?destination=${encodeURIComponent(c.name)}&adults=2&rooms=1`
                  )
                }
              />
            ))}
          {tab === "Destinations" &&
            destinations.map((d) => (
              <DestinationCard key={d.state} item={d} navigate={navigate} />
            ))}
        </div>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PopularSearches;
