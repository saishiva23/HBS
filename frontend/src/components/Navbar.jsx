import logo from "../assets/stays_img.png";
import {
  GlobeAltIcon,
  UserCircleIcon,
  Bars3Icon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MenuDropdown from "./MenuDropdown";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="w-full flex items-center justify-between h-20 px-4 md:px-12">

        {/* Logo */}
        <Link to="/" className="flex items-center h-full">
          <img
            src={logo}
            alt="stays.in"
            className="h-12 object-contain cursor-pointer"
          />
        </Link>

        {/* Right Controls */}
        <div className="flex items-center gap-4">

          <button className="flex items-center gap-2 border border-yellow-400 rounded-xl px-4 py-2 hover:bg-yellow-50">
            <GlobeAltIcon className="h-5 w-5" />
            EN · ₹
          </button>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 border border-yellow-400 rounded-xl px-4 py-2 hover:bg-yellow-50"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          <button 
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 border border-yellow-400 rounded-xl px-5 py-2 font-semibold hover:bg-yellow-50"
          >
            <UserCircleIcon className="h-5 w-5" />
            Sign in
          </button>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-2 border border-yellow-400 rounded-xl px-5 py-2 hover:bg-yellow-50"
            >
              <Bars3Icon className="h-5 w-5" />
              Menu
            </button>

            <MenuDropdown open={openMenu} onClose={() => setOpenMenu(false)} />
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

