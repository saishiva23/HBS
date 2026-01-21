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
    <div className="relative mt-10">

      {/* Search Bar */}
      <div className="bg-white shadow-xl rounded-2xl border overflow-hidden flex flex-col md:flex-row">

        {/* Destination */}
        <div className="flex items-center gap-4 px-6 py-4 flex-1 border-b md:border-b-0 md:border-r">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
          <div className="w-full">
            <input
              type="text"
              placeholder="Destination"
              className="outline-none font-semibold text-lg w-full"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
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
        </div>

        {/* Dates */}
        <div
          className="flex items-center gap-4 px-6 py-4 flex-1 border-b md:border-b-0 md:border-r cursor-pointer hover:bg-yellow-50 transition rounded-xl"
          onClick={() => {
            setOpenCalendar(true);
            setOpenGuests(false);
          }}
        >
          <CalendarIcon className="h-6 w-6 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Check-in/out</p>
            <p className="font-semibold text-lg">
              {format(dateRange[0].startDate, "dd MMM")} -{" "}
              {format(dateRange[0].endDate, "dd MMM")}
            </p>
          </div>
        </div>

        {/* Calendar Popup */}
        {openCalendar && (
          <div
            ref={calendarRef}
            className="absolute z-50 mt-4 left-0 bg-white shadow-2xl rounded-xl p-4"
          >
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
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setOpenCalendar(false)}
                className="px-4 py-2 border rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setOpenCalendar(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        )}



        {/* Guests */}
        <div
          className="flex items-center gap-4 px-6 py-4 flex-1 border-b md:border-b-0 md:border-r cursor-pointer hover:bg-yellow-50 transition rounded-xl"
          onClick={() => {
            setOpenGuests(true);
            setOpenCalendar(false);
          }}
        >
          <UserIcon className="h-6 w-6 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Guests and rooms</p>
            <p className="font-semibold text-lg">
              {adults} Guests, {rooms} Room
            </p>
          </div>
        </div>

        {/* Search Button */}
        {/* Search Button */}
        <button
          onClick={() => {
            if (!destination.trim()) {
              // You might want to show a toast or highlight the input
              // For now we just return
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
          className={`bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-lg px-10 py-3 rounded-xl mx-4 my-3 shadow-md ${
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
          className="absolute z-50 mt-4 right-0 bg-white shadow-2xl rounded-xl p-6 w-80"
        >
          {/* Adults */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Adults</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setAdults(Math.max(1, adults - 1))}>
                <MinusIcon className="h-6 w-6 border rounded-full p-1" />
              </button>
              <span>{adults}</span>
              <button onClick={() => setAdults(adults + 1)}>
                <PlusIcon className="h-6 w-6 border rounded-full p-1" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Children</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setChildren(Math.max(0, children - 1))}>
                <MinusIcon className="h-6 w-6 border rounded-full p-1" />
              </button>
              <span>{children}</span>
              <button onClick={() => setChildren(children + 1)}>
                <PlusIcon className="h-6 w-6 border rounded-full p-1" />
              </button>
            </div>
          </div>

          {/* Rooms */}
          <div className="flex justify-between items-center mb-6">
            <span className="font-semibold">Rooms</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setRooms(Math.max(1, rooms - 1))}>
                <MinusIcon className="h-6 w-6 border rounded-full p-1" />
              </button>
              <span>{rooms}</span>
              <button onClick={() => setRooms(rooms + 1)}>
                <PlusIcon className="h-6 w-6 border rounded-full p-1" />
              </button>
            </div>
          </div>

          {/* Pets */}
          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              checked={petsAllowed}
              onChange={() => setPetsAllowed(!petsAllowed)}
              className="w-4 h-4"
            />
            <span>Pet-friendly stays only</span>
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
              className="text-gray-400 font-semibold"
            >
              RESET
            </button>

            <button
              onClick={() => setOpenGuests(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
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
