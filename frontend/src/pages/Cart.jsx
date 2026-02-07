import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrashIcon,
  ShoppingCartIcon,
  PencilIcon,
  MinusIcon,
  PlusIcon,
  CalendarIcon,
  UserGroupIcon,
  XMarkIcon,
  CheckIcon
} from "@heroicons/react/24/outline";
import { calculateNights, currency } from "../utils/bookingUtils";
import customerAPI from "../services/customerAPI";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../contexts/ToastContext";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("hotelCart") || "[]");
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Proceed to checkout - Create actual booking
  const handleCheckout = async () => {
    if (cartItems.length === 0 || !isAuthenticated) {
      showToast('Please login to proceed with booking.', 'warning');
      navigate('/login');
      return;
    }

    try {
      await customerAPI.cartPage.checkout(cartItems);
      clearCart();
      showToast('Booking confirmed! Check your bookings page.', 'success');
      navigate('/bookings');
    } catch (error) {
      console.error('Booking failed:', error);
      showToast(`Booking failed: ${error.message || 'Please try again.'}`, 'error');
    }
  };

  // Sync with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = JSON.parse(localStorage.getItem("hotelCart") || "[]");
      setCartItems(stored);
    };

    window.addEventListener("cartUpdated", handleStorageChange);
    return () => window.removeEventListener("cartUpdated", handleStorageChange);
  }, []);

  // Remove item from cart
  const removeItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem("hotelCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("hotelCart");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Start editing an item
  const startEdit = (index) => {
    setEditingIndex(index);
    setEditForm({
      guests: cartItems[index].guests || 2,
      rooms: cartItems[index].rooms || 1,
      checkIn: cartItems[index].checkIn || "",
      checkOut: cartItems[index].checkOut || ""
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingIndex(null);
    setEditForm({});
  };

  // Save edited item
  const saveEdit = (index) => {
    const item = cartItems[index];
    const nights = calculateNights(editForm.checkIn, editForm.checkOut);

    const updated = cartItems.map((cartItem, i) => {
      if (i === index) {
        return {
          ...cartItem,
          guests: editForm.guests,
          rooms: editForm.rooms,
          checkIn: editForm.checkIn,
          checkOut: editForm.checkOut,
          nights: nights,
          price: item.basePrice * editForm.rooms * nights
        };
      }
      return cartItem;
    });

    setCartItems(updated);
    localStorage.setItem("hotelCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    setEditingIndex(null);
  };

  const updateRooms = (index, delta) => {
    const item = cartItems[index];
    const newRooms = Math.max(1, Math.min(10, (item.rooms || 1) + delta));
    const nights = calculateNights(item.checkIn, item.checkOut);

    const updated = cartItems.map((cartItem, i) => {
      if (i === index) {
        return {
          ...cartItem,
          rooms: newRooms,
          price: item.basePrice * newRooms * nights
        };
      }
      return cartItem;
    });

    setCartItems(updated);
    localStorage.setItem("hotelCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalRooms = cartItems.reduce((sum, item) => sum + (item.rooms || 1), 0);

  // Proceed to checkout - removed duplicate function

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <ShoppingCartIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold dark:text-white transition-colors">
                Your Cart
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} • {totalRooms} {totalRooms === 1 ? 'room' : 'rooms'}
              </p>
            </div>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
              Clear All
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
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
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Search Hotels
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden transition-all hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Hotel Image */}
                    <div className="w-full md:w-48 h-40 md:h-auto flex-shrink-0">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400"}
                        alt={item.hotel}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold dark:text-white">{item.hotel}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{item.roomType}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(index)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                            title="Edit item"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => removeItem(index)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="Remove item"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {editingIndex === index ? (
                        /* Edit Form */
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-in</label>
                              <input
                                type="date"
                                value={editForm.checkIn}
                                onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-yellow-400"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out</label>
                              <input
                                type="date"
                                value={editForm.checkOut}
                                onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-yellow-400"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guests</label>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={editForm.guests}
                                onChange={(e) => setEditForm({ ...editForm, guests: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-yellow-400"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rooms</label>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={editForm.rooms}
                                onChange={(e) => setEditForm({ ...editForm, rooms: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-yellow-400"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={cancelEdit}
                              className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                              <XMarkIcon className="h-4 w-4" />
                              Cancel
                            </button>
                            <button
                              onClick={() => saveEdit(index)}
                              className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition"
                            >
                              <CheckIcon className="h-4 w-4" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Display Mode */
                        <>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {item.checkIn} - {item.checkOut}
                            </span>
                            <span className="flex items-center gap-1">
                              <UserGroupIcon className="h-4 w-4" />
                              {item.guests} Guest{item.guests !== 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300 font-medium">
                              {item.nights || 1} Night{(item.nights || 1) !== 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* Room Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium dark:text-gray-300">Rooms:</span>
                              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                <button
                                  onClick={() => updateRooms(index, -1)}
                                  disabled={item.rooms <= 1}
                                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                  <MinusIcon className="h-4 w-4 dark:text-white" />
                                </button>
                                <span className="w-8 text-center font-semibold dark:text-white">{item.rooms || 1}</span>
                                <button
                                  onClick={() => updateRooms(index, 1)}
                                  disabled={item.rooms >= 10}
                                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                  <PlusIcon className="h-4 w-4 dark:text-white" />
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currency(item.price)}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">total stay</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 sticky top-28">
                <h3 className="text-xl font-bold dark:text-white mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({totalRooms} rooms)</span>
                    <span className="font-medium dark:text-white">{currency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Taxes & Fees</span>
                    <span className="font-medium dark:text-white">{currency(totalPrice * 0.18)}</span>
                  </div>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <div className="flex justify-between text-lg font-bold dark:text-white">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">{currency(totalPrice * 1.18)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || cartItems.some(item => !item.checkIn || !item.checkOut || item.checkIn === 'Not selected' || item.checkOut === 'Not selected')}
                  className={`w-full py-3 rounded-lg font-semibold mb-4 transition-colors ${cartItems.length === 0 || cartItems.some(item => !item.checkIn || !item.checkOut || item.checkIn === 'Not selected' || item.checkOut === 'Not selected')
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                    }`}
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400 text-center">
                    ✓ Free cancellation available
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
