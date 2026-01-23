import logo from "../assets/stays_img.png";
import {
  UserCircleIcon,
  ShoppingCartIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MenuDropdown from "./MenuDropdown";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, getUserInitials } = useAuth();

  // Update cart count on mount and when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("hotelCart") || "[]");
      setCartCount(cart.length);
    };

    updateCartCount();

    // Listen for storage changes (from other tabs or components)
    window.addEventListener("storage", updateCartCount);

    // Custom event listener for same-tab updates
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Apply dark mode on initial load
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="w-full flex items-center justify-between h-20 px-4 md:px-12">

        {/* Logo */}
        <Link to="/" className="flex items-center h-full">
          <img
            src={logo}
            alt="stays.in"
            className="h-12 object-contain cursor-pointer dark:brightness-110"
          />
        </Link>

        {/* Right Controls */}
        <div className="flex items-center gap-4">

          {/* Dark Mode Toggle */}
          <button
            onClick={() => {
              const newMode = !darkMode;
              setDarkMode(newMode);
              localStorage.setItem("darkMode", String(newMode));
              document.documentElement.classList.toggle("dark", newMode);
            }}
            className="flex items-center gap-2 border border-yellow-400 rounded-xl px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          {/* Cart Icon - Only show when authenticated */}
          {isAuthenticated && (
            <Link
              to="/cart"
              className="relative flex items-center gap-2 border border-yellow-400 rounded-xl px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* User Avatar / Sign In Button */}
          {isAuthenticated ? (
            <div ref={menuRef} className="relative">
              {/* Logged In - Show User Avatar with Initial */}
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-2 group"
              >
                {/* User Avatar Circle */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  {getUserInitials()}
                </div>
              </button>

              {/* Dropdown Menu for authenticated users */}
              <MenuDropdown open={openMenu} onClose={() => setOpenMenu(false)} />
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 border border-yellow-400 rounded-xl px-5 py-2 font-semibold hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
            >
              <UserCircleIcon className="h-5 w-5" />
              Sign in
            </button>
          )}

          {/* Menu Button - Only show if NOT authenticated */}
          {!isAuthenticated && (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-2 border border-yellow-400 rounded-xl px-5 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                Menu
              </button>
              {/* Dropdown Menu for non-authenticated users */}
              <MenuDropdown open={openMenu} onClose={() => setOpenMenu(false)} />
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
