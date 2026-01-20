import { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
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

const SearchBar = () => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openGuests, setOpenGuests] = useState(false);

  const calendarRef = useRef(null);
  const guestsRef = useRef(null);

  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [petsAllowed, setPetsAllowed] = useState(false);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        guestsRef.current &&
        !guestsRef.current.contains(e.target)
      ) {
        setOpenCalendar(false);
        setOpenGuests(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <p className="text-xs text-gray-500">Destination</p>
            <input
              type="text"
              placeholder="Where to?"
              className="outline-none font-semibold text-lg w-full"
            />
          </div>
        </div>

        {/* Dates */}
        <div
          className="flex items-center gap-4 px-6 py-4 flex-1 border-b md:border-b-0 md:border-r cursor-pointer hover:bg-gray-50"
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

        {/* Guests */}
        <div
          className="flex items-center gap-4 px-6 py-4 flex-1 border-b md:border-b-0 md:border-r cursor-pointer hover:bg-gray-50"
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
        <button className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-lg px-10 py-4 md:py-0">
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
