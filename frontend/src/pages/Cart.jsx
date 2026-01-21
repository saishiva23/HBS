import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrashIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

const currency = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("hotelCart") || "[]");
    setCartItems(stored);
  }, []);

  const removeItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem("hotelCart", JSON.stringify(updated));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("hotelCart");
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCartIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-3xl font-bold dark:text-white transition-colors">Your Cart</h1>
        {cartItems.length > 0 && (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold transition-colors">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm transition-colors text-center">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-6">
            <ShoppingCartIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            Looks like you haven't added any hotels yet. Start searching for your perfect stay!
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Search Hotels
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-4 flex items-center justify-between gap-4 transition-colors"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold dark:text-white">{item.hotel}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.roomType}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-500">
                  <span>📅 {item.checkIn} - {item.checkOut}</span>
                  <span>👥 {item.guests} Guest{item.guests !== "1" ? "s" : ""}</span>
                  <span>🛏️ {item.rooms} Room{item.rooms !== "1" ? "s" : ""}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold dark:text-white">{currency(item.price)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">per night</p>
              </div>
              <button
                onClick={() => removeItem(index)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                title="Remove item"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}

          {/* Cart Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border dark:border-gray-700 p-6 mt-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Subtotal</span>
              <span className="text-2xl font-bold dark:text-white">{currency(totalPrice)}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Taxes and fees will be calculated at checkout
            </p>
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Clear Cart
              </button>
              <button className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Proceed to Checkout
              </button>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="text-center mt-6">
            <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
