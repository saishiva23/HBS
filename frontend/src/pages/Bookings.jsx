import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TicketIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilIcon,
  StarIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { FaTicketAlt, FaStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useReviews } from "../context/ReviewsContext";
import AccountLayout from "../components/AccountLayout";
import { downloadInvoice } from "../utils/bookingUtils";
import customerAPI from "../services/customerAPI";
import { complaintAPI } from "../services/completeAPI";
import ReviewModal from "../components/ReviewModal";
import ComplaintModal from "../components/ComplaintModal";
import BookingNotificationBanner from "../components/BookingNotificationBanner";
import { useToast } from "../contexts/ToastContext";

const currency = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

const Bookings = () => {
  const { isAuthenticated, user } = useAuth();
  const { addReview } = useReviews();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editForm, setEditForm] = useState({
    checkIn: '',
    checkOut: '',
    rooms: 1
  });

  // Load bookings from backend API
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserBookings();

      // Poll for booking updates every 30 seconds
      const pollInterval = setInterval(() => {
        fetchUserBookings();
      }, 30000); // 30 seconds

      return () => clearInterval(pollInterval);
    }
  }, [isAuthenticated]);

  const fetchUserBookings = async () => {
    try {
      const response = await customerAPI.bookingsPage.loadBookings();
      const backendBookings = response.map(booking => ({
        id: booking.id,
        hotelId: booking.hotelId,
        hotel: booking.hotelName,
        hotelName: booking.hotelName,
        city: booking.hotelCity,
        roomType: booking.roomTypeName,
        checkIn: booking.checkInDate,
        checkInDate: booking.checkInDate,
        checkOut: booking.checkOutDate,
        checkOutDate: booking.checkOutDate,
        guests: booking.adults + booking.children,
        rooms: booking.rooms,
        price: booking.totalPrice,
        status: booking.status.toLowerCase(),
        bookingDate: booking.bookingDate,
        bookingReference: booking.bookingReference,
        roomNumbers: booking.roomNumbersDisplay || 'Not assigned yet',
        assignedRoomNumbers: booking.assignedRoomNumbers || [],
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60",
        reviewed: false
      }));

      // Check for newly cancelled bookings and show toast
      const previousBookings = bookings;
      const newlyCancelled = backendBookings.filter(booking => {
        const wasActive = previousBookings.find(prev =>
          prev.id === booking.id && prev.status !== 'cancelled'
        );
        return booking.status === 'cancelled' && wasActive;
      });

      // Show toast for newly cancelled bookings
      if (newlyCancelled.length > 0) {
        newlyCancelled.forEach(booking => {
          showToast(
            `Booking cancelled: ${booking.hotelName} (${booking.bookingReference})`,
            'error'
          );
        });
      }

      setBookings(backendBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fallback to empty array if API fails
      setBookings([]);
    }
  };

  // Cancel booking
  const handleCancelBooking = async () => {
    try {
      await customerAPI.bookingsPage.cancelBooking(selectedBooking.id);
      await fetchUserBookings(); // Refresh bookings
      setShowCancelModal(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showToast('Failed to cancel booking. Please try again.', 'error');
    }
  };

  // Open edit modal
  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      rooms: booking.rooms
    });
    setShowEditModal(true);
  };

  // Update booking
  const handleUpdateBooking = () => {
    const updated = bookings.map(b =>
      b.id === selectedBooking.id
        ? { ...b, checkIn: editForm.checkIn, checkOut: editForm.checkOut, rooms: editForm.rooms }
        : b
    );
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
    setShowEditModal(false);
    setSelectedBooking(null);
  };

  // Open Review Modal
  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  // Handle review success
  const handleReviewSuccess = async () => {
    // Refresh bookings to update UI
    await fetchUserBookings();
    setShowReviewModal(false);
    setSelectedBooking(null);
  };

  // Open Complaint Modal
  const openComplaintModal = (booking) => {
    setSelectedBooking(booking);
    setShowComplaintModal(true);
  };

  // Handle complaint success
  const handleComplaintSuccess = async () => {
    // Refresh bookings if needed
    await fetchUserBookings();
    setShowComplaintModal(false);
    setSelectedBooking(null);
  };

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  // Render star rating
  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate && onRate(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            {star <= rating ? (
              <StarIconSolid className="h-6 w-6 text-yellow-400" />
            ) : (
              <StarIcon className="h-6 w-6 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <AccountLayout>
      {/* Create Account Banner - Only for non-authenticated users */}
      {!isAuthenticated && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <FaTicketAlt className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold dark:text-white">Manage your bookings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sign in to view, update, or cancel your hotel bookings.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2.5 border-2 border-gray-800 dark:border-white rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition"
          >
            Create account
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold dark:text-white mb-6">Bookings</h1>

      {/* Not Logged In State */}
      {!isAuthenticated ? (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-12 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <TicketIcon className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold dark:text-white mb-2">Your bookings</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Sign in to view and manage your bookings</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition shadow-lg"
          >
            Sign in
          </button>
        </div>
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'All' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'pending', label: 'Pending' },
              { key: 'completed', label: 'Past Stays' },
              { key: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${filter === tab.key
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-12 text-center">
              <TicketIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold dark:text-white mb-2">No bookings found</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {filter === 'all'
                  ? "You haven't made any bookings yet."
                  : `No ${filter === 'completed' ? 'past stays' : filter} bookings.`}
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-semibold"
              >
                Explore Hotels
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                      <img
                        src={booking.image}
                        alt={booking.hotel}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold dark:text-white">{booking.hotel}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4" />
                            {booking.city} • {booking.roomType}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(booking.status)}`}>
                          {booking.status === 'completed' ? 'PAST STAY' : booking.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Check-in</p>
                          <p className="font-semibold dark:text-white flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-blue-500" />
                            {booking.checkIn}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Check-out</p>
                          <p className="font-semibold dark:text-white flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-blue-500" />
                            {booking.checkOut}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Guests & Rooms</p>
                          <p className="font-semibold dark:text-white flex items-center gap-1">
                            <UserGroupIcon className="h-4 w-4 text-blue-500" />
                            {booking.guests} Guests, {booking.rooms} Room
                          </p>
                        </div>
                        {booking.roomNumbers && booking.roomNumbers !== 'Not assigned yet' && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Room Number(s)</p>
                            <p className="font-semibold dark:text-white flex items-center gap-1">
                              <TicketIcon className="h-4 w-4 text-green-500" />
                              {booking.roomNumbers}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {currency(booking.price)}
                          </p>
                        </div>

                        {/* Assigned Room Numbers */}
                        {booking.assignedRoomNumbers && booking.assignedRoomNumbers.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Assigned Rooms</p>
                            <p className="font-semibold dark:text-white flex items-center gap-1">
                              <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              {booking.assignedRoomNumbers.join(', ')}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Show existing review if available */}
                      {booking.reviewed && booking.review && (
                        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={`h-4 w-4 ${star <= booking.review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                              Your Review
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{booking.review.title}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{booking.review.comment}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        {/* Download Invoice */}
                        <button
                          onClick={() => downloadInvoice(booking)}
                          className="flex items-center gap-2 px-4 py-2 border border-blue-400 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          Invoice
                        </button>

                        {/* Update/Cancel - Only for confirmed/pending bookings */}
                        {(booking.status === 'confirmed' || booking.status === 'pending') && (
                          <>
                            <button
                              onClick={() => openEditModal(booking)}
                              className="flex items-center gap-2 px-4 py-2 border border-blue-400 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                              <PencilIcon className="h-4 w-4" />
                              Update Booking
                            </button>
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowCancelModal(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <XMarkIcon className="h-4 w-4" />
                              Cancel Booking
                            </button>
                          </>
                        )}

                        {/* Write Review - Only for completed bookings that haven't been reviewed */}
                        {booking.status === 'completed' && !booking.reviewed && (
                          <button
                            onClick={() => openReviewModal(booking)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md"
                          >
                            <FaStar className="h-4 w-4" />
                            Write a Review
                          </button>
                        )}

                        {/* Report Issue - For any booking that is not cancelled */}
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => openComplaintModal(booking)}
                            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            Report Issue
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Edit Booking Modal */}
      {showEditModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold dark:text-white mb-4">Update Booking</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedBooking.hotel}</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-in Date</label>
                <input
                  type="date"
                  value={editForm.checkIn}
                  onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out Date</label>
                <input
                  type="date"
                  value={editForm.checkOut}
                  onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Rooms</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editForm.rooms}
                  onChange={(e) => setEditForm({ ...editForm, rooms: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBooking}
                className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-bold"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <XMarkIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">Cancel Booking</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to cancel your booking at <strong>{selectedBooking.hotel}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Review Modal Component */}
      {showReviewModal && selectedBooking && (
        <ReviewModal
          booking={{
            id: selectedBooking.id,
            hotelId: selectedBooking.hotelId,
            hotelName: selectedBooking.hotel,
            hotel: selectedBooking.hotel
          }}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedBooking(null);
          }}
          onSuccess={handleReviewSuccess}
        />
      )}

      {/* New Complaint Modal Component */}
      {showComplaintModal && selectedBooking && (
        <ComplaintModal
          booking={{
            id: selectedBooking.id,
            hotelId: selectedBooking.hotelId,
            hotelName: selectedBooking.hotel,
            hotel: selectedBooking.hotel
          }}
          onClose={() => {
            setShowComplaintModal(false);
            setSelectedBooking(null);
          }}
          onSuccess={handleComplaintSuccess}
        />
      )}

      {/* Booking Cancellation Notification Banner */}
      <BookingNotificationBanner bookings={bookings} />
    </AccountLayout>
  );
};

export default Bookings;

