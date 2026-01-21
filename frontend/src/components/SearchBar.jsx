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
} from "@heroicons/react/24/outline";

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

  // Animated label state
  const [currentLabelIndex, setCurrentLabelIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const calendarRef = useRef(null);
  const guestsRef = useRef(null);
  const navigate = useNavigate();

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
  const [petsAllowed, setPetsAllowed] = useState(initialValues?.pets === "true" || false);

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

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openCalendar && calendarRef.current && !calendarRef.current.contains(e.target)) {
        setOpenCalendar(false);
      }

      if (openGuests && guestsRef.current && !guestsRef.current.contains(e.target)) {
        setOpenGuests(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openCalendar, openGuests]);


  // ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpenCalendar(false);
        setOpenGuests(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="relative mt-0">

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border dark:border-gray-700 overflow-hidden flex flex-col md:flex-row transition-colors">

        {/* Destination with Animated Label */}
        <div className="flex items-center gap-4 px-6 py-4 flex-1 border-b md:border-b-0 md:border-r dark:border-gray-700">
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
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where to?"
              className="outline-none font-semibold text-lg w-full bg-transparent dark:text-white dark:placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && destination.trim()) {
                  const params = new URLSearchParams({
                    destination: destination,
                    adults: String(adults),
                    children: String(children),
                    rooms: String(rooms),
                    start: format(dateRange[0].startDate, "dd MMM"),
                    end: format(dateRange[0].endDate, "dd MMM"),
                    pets: String(petsAllowed),
                  });
                  navigate(`/search?${params.toString()}`);
                }
              }}
            />
          </div>
          {/* Clear button when there's text */}
          {destination && (
            <button
              onClick={() => setDestination("")}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400" />
            </button>
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
                onClick={() => setOpenCalendar(false)}
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
              pets: String(petsAllowed),
            });
            navigate(`/search?${params.toString()}`);
          }}
          className={`bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-lg px-10 py-3 rounded-xl shadow-md ${
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

          {/* Pets */}
          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              checked={petsAllowed}
              onChange={() => setPetsAllowed(!petsAllowed)}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="dark:text-white">Pet-friendly stays only</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => {
                setAdults(2);
                setChildren(0);
                setRooms(1);
                setPetsAllowed(false);
              }}
              className="text-gray-400 font-semibold hover:text-gray-600 transition-colors"
            >
              RESET
            </button>

            <button
              onClick={() => setOpenGuests(false)}
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
