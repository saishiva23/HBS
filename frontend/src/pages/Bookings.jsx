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
  StarIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { FaTicketAlt, FaStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useReviews } from "../context/ReviewsContext";
import AccountLayout from "../components/AccountLayout";

const currency = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

const Bookings = () => {
  const { isAuthenticated, user } = useAuth();
  const { addReview } = useReviews();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editForm, setEditForm] = useState({
    checkIn: '',
    checkOut: '',
    rooms: 1
  });
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  // Load bookings from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const saved = localStorage.getItem("bookings");
      if (saved) {
        setBookings(JSON.parse(saved));
      } else {
        // Mock bookings for demo
        const mockBookings = [
          {
            id: 1,
            hotel: "Taj Lands End",
            city: "Mumbai",
            roomType: "Ocean View Room",
            checkIn: "2026-01-10",
            checkOut: "2026-01-13",
            guests: 2,
            rooms: 1,
            price: 55500,
            status: "completed",
            bookingDate: "2026-01-05",
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60",
            reviewed: false
          },
          {
            id: 2,
            hotel: "The Oberoi Udaivilas",
            city: "Udaipur",
            roomType: "Premier Lake View Room",
            checkIn: "2026-02-10",
            checkOut: "2026-02-14",
            guests: 2,
            rooms: 1,
            price: 180000,
            status: "confirmed",
            bookingDate: "2026-01-22",
            image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=60",
            reviewed: false
          },
          {
            id: 3,
            hotel: "ITC Grand Chola",
            city: "Chennai",
            roomType: "Grand Club Room",
            checkIn: "2026-01-05",
            checkOut: "2026-01-08",
            guests: 2,
            rooms: 1,
            price: 42000,
            status: "completed",
            bookingDate: "2025-12-28",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=60",
            reviewed: true,
            review: {
              rating: 5,
              title: "Amazing stay!",
              comment: "Exceptional service and beautiful property."
            }
          },
        ];
        setBookings(mockBookings);
        localStorage.setItem("bookings", JSON.stringify(mockBookings));
      }
    }
  }, [isAuthenticated]);

  // Cancel booking
  const handleCancelBooking = () => {
    const updated = bookings.map(b => 
      b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b
    );
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
    setShowCancelModal(false);
    setSelectedBooking(null);
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

  // Open review modal
  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setReviewForm({
      rating: 5,
      title: '',
      comment: ''
    });
    setShowReviewModal(true);
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

  // Submit review
  const handleSubmitReview = () => {
    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      alert('Please fill in all review fields');
      return;
    }
    
    // Save to global reviews context (contributes to hotel rating)
    addReview({
      hotelId: selectedBooking.hotelId || selectedBooking.id,
      hotelName: selectedBooking.hotel,
      userId: user?.email || 'guest',
      userName: user?.name || 'Guest User',
      rating: reviewForm.rating,
      title: reviewForm.title,
      comment: reviewForm.comment
    });
    
    // Mark booking as reviewed
    const updated = bookings.map(b => 
      b.id === selectedBooking.id 
        ? { 
            ...b, 
            reviewed: true, 
            review: {
              rating: reviewForm.rating,
              title: reviewForm.title,
              comment: reviewForm.comment,
              date: new Date().toISOString().split('T')[0]
            }
          } 
        : b
    );
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
    setShowReviewModal(false);
    setSelectedBooking(null);
    alert('Thank you for your review! Your rating contributes to the hotel\'s overall score.');
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
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {currency(booking.price)}
                          </p>
                        </div>
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
                  onChange={(e) => setEditForm({...editForm, checkIn: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out Date</label>
                <input
                  type="date"
                  value={editForm.checkOut}
                  onChange={(e) => setEditForm({...editForm, checkOut: e.target.value})}
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
                  onChange={(e) => setEditForm({...editForm, rooms: parseInt(e.target.value)})}
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

      {/* Review Modal - Only for completed bookings */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <FaStar className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold dark:text-white">Write a Review</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.hotel}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {renderStars(reviewForm.rating, true, (rating) => setReviewForm({...reviewForm, rating}))}
                  <span className="ml-2 text-lg font-bold text-yellow-500">{reviewForm.rating}/5</span>
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                  placeholder="Summarize your experience"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Review *
                </label>
                <textarea
                  rows="4"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  placeholder="Tell us about your stay. What did you like? What could be improved?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default Bookings;

