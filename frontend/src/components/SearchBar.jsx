import { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import customerAPI from "../services/customerAPI";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// Animated label options for the search bar
const SEARCH_LABELS = ["Hotel", "Landmark", "Destination", "City", "Resort", "Address"];

const SearchBar = ({ initialValues }) => {
  // Helper to parse dates like "21 Jan"
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const currentYear = new Date().getFullYear();
    const d = new Date(`${dateStr} ${currentYear}`);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const [openCalendar, setOpenCalendar] = useState(false);
  const [openGuests, setOpenGuests] = useState(false);
  const [destination, setDestination] = useState(initialValues?.destination || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

  // Animated label state
  const [currentLabelIndex, setCurrentLabelIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const calendarRef = useRef(null);
  const guestsRef = useRef(null);

  // Unified search handler
  const handleSearch = (overrideParams = {}) => {
    const params = new URLSearchParams({
      destination: overrideParams.destination ?? destination,
      adults: String(overrideParams.adults ?? adults),
      children: String(overrideParams.children ?? children),
      rooms: String(overrideParams.rooms ?? rooms),
      start: format(overrideParams.startDate ?? dateRange[0].startDate, "dd MMM"),
      end: format(overrideParams.endDate ?? dateRange[0].endDate, "dd MMM"),
    });
    
    // Only navigate if we have a destination
    if (params.get("destination")) {
      navigate(`/search?${params.toString()}`);
    }
  };

  const [dateRange, setDateRange] = useState([
    {
      startDate: initialValues?.start ? parseDate(initialValues.start) : new Date(),
      endDate: initialValues?.end ? parseDate(initialValues.end) : new Date(),
      key: "selection",
    },
  ]);

  const [adults, setAdults] = useState(Number(initialValues?.adults) || 2);
  const [children, setChildren] = useState(Number(initialValues?.children) || 0);
  const [rooms, setRooms] = useState(Number(initialValues?.rooms) || 1);

  // Auto-changing label animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      // After fade out, change the text
      setTimeout(() => {
        setCurrentLabelIndex((prev) => (prev + 1) % SEARCH_LABELS.length);
        setIsAnimating(false);
      }, 300); // Half of the transition duration

    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (destination.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoadingSuggestions(true);
      try {
        // Fetch hotels matching the search term
        const hotels = await customerAPI.hotels.getAll();
        
        // Filter and create suggestions
        const searchTerm = destination.toLowerCase();
        const hotelSuggestions = hotels
          .filter(hotel => 
            hotel.name.toLowerCase().includes(searchTerm) ||
            hotel.city.toLowerCase().includes(searchTerm) ||
            hotel.state?.toLowerCase().includes(searchTerm) ||
            hotel.address?.toLowerCase().includes(searchTerm)
          )
          .slice(0, 8)
          .map(hotel => ({
            type: 'hotel',
            name: hotel.name,
            location: `${hotel.city}, ${hotel.state || ''}`,
            city: hotel.city,
            state: hotel.state,
            id: hotel.id
          }));

        // Extract unique cities and states
        const cities = [...new Set(hotels.map(h => h.city))]
          .filter(city => city.toLowerCase().includes(searchTerm))
          .slice(0, 3)
          .map(city => ({
            type: 'city',
            name: city,
            location: 'City'
          }));

        const states = [...new Set(hotels.map(h => h.state).filter(Boolean))]
          .filter(state => state.toLowerCase().includes(searchTerm))
          .slice(0, 3)
          .map(state => ({
            type: 'state',
            name: state,
            location: 'State'
          }));

        // Combine suggestions: cities first, then states, then hotels
        const combined = [...cities, ...states, ...hotelSuggestions];
        setSuggestions(combined);
        setShowSuggestions(combined.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [destination]);

  // Synchronize state with props when initialValues change (e.g. URL update)
  useEffect(() => {
    if (initialValues) {
      if (initialValues.destination !== undefined) setDestination(initialValues.destination || "");
      if (initialValues.adults !== undefined) setAdults(Number(initialValues.adults) || 2);
      if (initialValues.children !== undefined) setChildren(Number(initialValues.children) || 0);
      if (initialValues.rooms !== undefined) setRooms(Number(initialValues.rooms) || 1);
      
      if (initialValues.start && initialValues.end) {
        setDateRange([
          {
            startDate: parseDate(initialValues.start),
            endDate: parseDate(initialValues.end),
            key: "selection",
          },
        ]);
      }
    }
  }, [initialValues]);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(e.target)
      ) {
        setOpenCalendar(false);
      }

      if (
        openGuests &&
        guestsRef.current &&
        !guestsRef.current.contains(e.target)
      ) {
        setOpenGuests(false);
      }

      if (
        showSuggestions &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openCalendar, openGuests, showSuggestions]);

  // ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpenCalendar(false);
        setOpenGuests(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    setDestination(suggestion.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter" && destination.trim()) {
        const params = new URLSearchParams({
          destination: destination,
          adults: String(adults),
          children: String(children),
          rooms: String(rooms),
          start: format(dateRange[0].startDate, "dd MMM"),
          end: format(dateRange[0].endDate, "dd MMM"),
        });
        navigate(`/search?${params.toString()}`);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else if (destination.trim()) {
          const params = new URLSearchParams({
            destination: destination,
            adults: String(adults),
            children: String(children),
            rooms: String(rooms),
            start: format(dateRange[0].startDate, "dd MMM"),
            end: format(dateRange[0].endDate, "dd MMM"),
          });
          navigate(`/search?${params.toString()}`);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative mt-0">

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border dark:border-gray-700 overflow-hidden flex flex-col md:flex-row transition-colors">

        {/* Destination with Animated Label */}
        <div className="flex items-center gap-4 px-6 py-4 flex-1 border-b md:border-b-0 md:border-r dark:border-gray-700 relative">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          <div className="w-full">
            {/* Animated Label */}
            <p
              className={`text-xs transition-all duration-300 ease-in-out ${isAnimating
                  ? 'opacity-0 transform -translate-y-1'
                  : 'opacity-100 transform translate-y-0'
                }`}
              style={{ color: '#10B981' }}
            >
              {SEARCH_LABELS[currentLabelIndex]}
            </p>
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setSelectedIndex(-1);
              }}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder="Where to?"
              className="outline-none font-semibold text-lg w-full bg-transparent dark:text-white dark:placeholder-gray-400"
              onKeyDown={handleKeyDown}
            />
          </div>
          {/* Clear button when there's text */}
          {destination && (
            <button
              onClick={() => {
                setDestination("");
                setShowSuggestions(false);
                setSuggestions([]);
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400" />
            </button>
          )}

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 shadow-2xl rounded-xl border dark:border-gray-700 max-h-96 overflow-y-auto z-50"
            >
              {loadingSuggestions && (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  Searching...
                </div>
              )}
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.type}-${suggestion.name}-${index}`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 ${
                    index === selectedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  } ${index === 0 ? 'rounded-t-xl' : ''} ${
                    index === suggestions.length - 1 ? 'rounded-b-xl' : 'border-b dark:border-gray-700'
                  }`}
                >
                  {suggestion.type === 'hotel' ? (
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  ) : (
                    <MapPinIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {suggestion.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {suggestion.location}
                    </p>
                  </div>
                  {suggestion.type === 'city' && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                      City
                    </span>
                  )}
                  {suggestion.type === 'state' && (
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full">
                      State
                    </span>
                  )}
                  {suggestion.type === 'hotel' && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                      Hotel
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dates */}
        <div
          className="flex items-center gap-4 px-6 py-4 flex-1 border-b md:border-b-0 md:border-r dark:border-gray-700 cursor-pointer hover:bg-yellow-50 dark:hover:bg-gray-700 transition rounded-xl"
          onClick={() => {
            setOpenCalendar(true);
            setOpenGuests(false);
          }}
        >
          <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Check-in/out</p>
            <p className="font-semibold text-lg dark:text-white">
              {format(dateRange[0].startDate, "dd MMM")} -{" "}
              {format(dateRange[0].endDate, "dd MMM")}
            </p>
          </div>
        </div>

        {/* Calendar Popup */}
        {openCalendar && (
          <div
            ref={calendarRef}
            className="absolute z-50 mt-4 left-0 bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-4 border dark:border-gray-700"
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setOpenCalendar(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="dark:invert dark:hue-rotate-180">
              <DateRange
                editableDateInputs={true}
                onChange={(item) => {
                  const sel = item.selection;
                  const start = sel.startDate;
                  const end =
                    sel.endDate && sel.endDate >= sel.startDate
                      ? sel.endDate
                      : sel.startDate;
                  setDateRange([{ startDate: start, endDate: end, key: "selection" }]);
                }}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                months={2}
                direction="horizontal"
                className="rounded-lg"
                minDate={new Date()}
              />
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setOpenCalendar(false)}
                className="px-4 py-2 border dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setOpenCalendar(false);
                  handleSearch();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Guests */}
        <div
          className="flex items-center gap-4 px-6 py-4 flex-1 border-b md:border-b-0 md:border-r dark:border-gray-700 cursor-pointer hover:bg-yellow-50 dark:hover:bg-gray-700 transition rounded-xl"
          onClick={() => {
            setOpenGuests(true);
            setOpenCalendar(false);
          }}
        >
          <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Guests and rooms</p>
            <p className="font-semibold text-lg dark:text-white">
              {adults} Guests, {rooms} Room
            </p>
          </div>
        </div>


        {/* Search Button */}
        <button
          onClick={() => {
            if (!destination.trim()) {
              return;
            }
            const params = new URLSearchParams({
              destination: destination,
              adults: String(adults),
              children: String(children),
              rooms: String(rooms),
              start: format(dateRange[0].startDate, "dd MMM"),
              end: format(dateRange[0].endDate, "dd MMM"),
            });
            navigate(`/search?${params.toString()}`);
          }}
          className={`bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-lg px-10 py-2  rounded-xl shadow-md ${
            !destination.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!destination.trim()}
        >
          Search
        </button>
      </div>

      {/* Guests Popup */}
      {openGuests && (
        <div
          ref={guestsRef}
          className="absolute z-50 mt-4 right-0 bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-6 w-80 border dark:border-gray-700 transition-colors"
        >
          {/* Adults */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold dark:text-white">Adults</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setAdults(Math.max(1, adults - 1))}>
                <MinusIcon className="h-6 w-6 border dark:border-gray-600 rounded-full p-1 dark:text-white" />
              </button>
              <span className="dark:text-white">{adults}</span>
              <button onClick={() => setAdults(adults + 1)}>
                <PlusIcon className="h-6 w-6 border dark:border-gray-600 rounded-full p-1 dark:text-white" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold dark:text-white">Children</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setChildren(Math.max(0, children - 1))}>
                <MinusIcon className="h-6 w-6 border dark:border-gray-600 rounded-full p-1 dark:text-white" />
              </button>
              <span className="dark:text-white">{children}</span>
              <button onClick={() => setChildren(children + 1)}>
                <PlusIcon className="h-6 w-6 border dark:border-gray-600 rounded-full p-1 dark:text-white" />
              </button>
            </div>
          </div>

          {/* Rooms */}
          <div className="flex justify-between items-center mb-6">
            <span className="font-semibold dark:text-white">Rooms</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setRooms(Math.max(1, rooms - 1))}>
                <MinusIcon className="h-6 w-6 border dark:border-gray-600 rounded-full p-1 dark:text-white" />
              </button>
              <span className="dark:text-white">{rooms}</span>
              <button onClick={() => setRooms(rooms + 1)}>
                <PlusIcon className="h-6 w-6 border dark:border-gray-600 rounded-full p-1 dark:text-white" />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => {
                setAdults(2);
                setChildren(0);
                setRooms(1);
              }}
              className="text-gray-400 font-semibold hover:text-gray-600 transition-colors"
            >
              RESET
            </button>

            <button
              onClick={() => {
                setOpenGuests(false);
                handleSearch();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
