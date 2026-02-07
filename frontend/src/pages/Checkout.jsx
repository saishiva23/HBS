import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CreditCardIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { calculateNights, currency, downloadInvoice, sendInvoiceEmail } from "../utils/bookingUtils";
import api from "../services/api";
import toast from 'react-hot-toast';



const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Form state
  const [guestDetails, setGuestDetails] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    specialRequests: ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    saveCard: false
  });

  const [bookingRef, setBookingRef] = useState("");

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("hotelCart") || "[]");
    if (cart.length === 0) {
      navigate("/cart");
      return;
    }
    setCartItems(cart);
  }, [navigate]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const taxes = subtotal * 0.18;
  const total = subtotal + taxes;

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create bookings for each cart item
      const bookingPromises = cartItems.map(item => {
        // Validate required fields - don't use fallbacks that will cause backend errors
        if (!item.hotelId || !item.roomTypeId) {
          throw new Error(`Invalid booking: Missing hotel or room type for ${item.hotel}. Please re-add this item to your cart.`);
        }

        const bookingData = {
          hotelId: item.hotelId,
          roomTypeId: item.roomTypeId,
          checkInDate: item.checkIn,
          checkOutDate: item.checkOut,
          adults: item.guests || 2,
          children: 0,
          rooms: item.rooms || 1,
          // Guest Details
          guestFirstName: guestDetails.firstName,
          guestLastName: guestDetails.lastName,
          guestEmail: guestDetails.email,
          guestPhone: guestDetails.phone
        };
        return api.post('/bookings', bookingData);
      });

      const responses = await Promise.all(bookingPromises);
      console.log('Bookings created:', responses);

      // Save to local booking history (optional, or rely on backend)
      const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      // We can add the response DTOs here if needed

      // Clear cart
      localStorage.removeItem("hotelCart");
      window.dispatchEvent(new Event("cartUpdated"));

      const newBookingRef = Date.now().toString().slice(-8);
      setBookingRef(newBookingRef);

      // Construct booking object for invoice/email
      const bookingForInvoice = {
        id: newBookingRef,
        hotel: cartItems[0]?.hotel,
        checkIn: cartItems[0]?.checkIn,
        checkOut: cartItems[0]?.checkOut,
        roomType: cartItems[0]?.roomType,
        price: total,
        guestDetails: guestDetails,
        roomTypeId: cartItems[0]?.roomTypeId // Ensure all needed fields are present
      };

      // Automatically trigger email (no download)
      sendInvoiceEmail(bookingForInvoice);

      setLoading(false);
      setOrderComplete(true);
      setStep(3);
      toast.success("Booking confirmed successfully!");
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error(error.message || "Failed to process booking");
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold dark:text-white mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your booking has been successfully placed. A confirmation email has been sent to {guestDetails.email}.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Booking Reference</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">HBS-{bookingRef}</p>
            </div>

            <div className="mb-8">
              <button
                onClick={() => {
                  // Create a temporary booking object for the invoice
                  // Create a temporary booking object for the invoice
                  const bookingForInvoice = {
                    id: bookingRef,
                    hotel: cartItems[0]?.hotel,
                    checkIn: cartItems[0]?.checkIn,
                    checkOut: cartItems[0]?.checkOut,
                    roomType: cartItems[0]?.roomType,
                    price: total,
                    guestDetails: guestDetails
                  };
                  downloadInvoice(bookingForInvoice);
                }}
                className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download Invoice
              </button>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                to="/bookings"
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition"
              >
                View Bookings
              </Link>
              <Link
                to="/"
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[
            { num: 1, label: 'Guest Details' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Confirmation' }
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${step >= s.num
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                {step > s.num ? <CheckCircleIcon className="h-6 w-6" /> : s.num}
              </div>
              <span className={`ml-2 font-medium ${step >= s.num ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {s.label}
              </span>
              {i < 2 && (
                <div className={`w-20 h-1 mx-4 rounded ${step > s.num ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <form onSubmit={handleGuestSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6">
                <h2 className="text-xl font-bold dark:text-white mb-6">Guest Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={guestDetails.firstName}
                      onChange={(e) => setGuestDetails({ ...guestDetails, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={guestDetails.lastName}
                      onChange={(e) => setGuestDetails({ ...guestDetails, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={guestDetails.email}
                      onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={guestDetails.phone}
                      onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Requests (Optional)</label>
                  <textarea
                    rows={3}
                    value={guestDetails.specialRequests}
                    onChange={(e) => setGuestDetails({ ...guestDetails, specialRequests: e.target.value })}
                    placeholder="Early check-in, room preferences, etc."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition shadow-lg"
                >
                  Continue to Payment
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePaymentSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCardIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold dark:text-white">Payment Details</h2>
                </div>

                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-6">
                  <LockClosedIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-700 dark:text-green-400">Your payment information is secure and encrypted</span>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cardholder Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={paymentDetails.cardName}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date *</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      maxLength={5}
                      value={paymentDetails.expiry}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV *</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="•••"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Pay ${currency(total)}`
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6 sticky top-28">
              <h3 className="text-xl font-bold dark:text-white mb-4">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=100"}
                      alt={item.hotel}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold dark:text-white text-sm">{item.hotel}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.roomType}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                        <span>{item.rooms} room{item.rooms > 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>{item.guests} guest{item.guests > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 border-t dark:border-gray-700 pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium dark:text-white">{currency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Taxes & Fees (18%)</span>
                  <span className="font-medium dark:text-white">{currency(taxes)}</span>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="flex justify-between text-lg font-bold dark:text-white">
                  <span>Total</span>
                  <span className="text-blue-600 dark:text-blue-400">{currency(total)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-700 dark:text-blue-400">Best Price Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
