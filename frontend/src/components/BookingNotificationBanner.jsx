import { useState, useEffect } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const BookingNotificationBanner = ({ bookings }) => {
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(() => {
    const stored = localStorage.getItem('dismissedCancelledBookings');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (!bookings || bookings.length === 0) return;

    // Find recently cancelled bookings (within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentlyCancelled = bookings.filter(booking => {
      if (booking.status !== 'CANCELLED') return false;
      if (dismissedIds.includes(booking.id)) return false;
      
      // Check if cancelled recently (you may need to add a cancelledAt field in backend)
      // For now, we'll show all cancelled bookings that haven't been dismissed
      return true;
    });

    setCancelledBookings(recentlyCancelled);
  }, [bookings, dismissedIds]);

  const handleDismiss = (bookingId) => {
    const updated = [...dismissedIds, bookingId];
    setDismissedIds(updated);
    localStorage.setItem('dismissedCancelledBookings', JSON.stringify(updated));
  };

  const handleDismissAll = () => {
    const allIds = cancelledBookings.map(b => b.id);
    const updated = [...dismissedIds, ...allIds];
    setDismissedIds(updated);
    localStorage.setItem('dismissedCancelledBookings', JSON.stringify(updated));
  };

  if (cancelledBookings.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg shadow-lg p-4 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                {cancelledBookings.length === 1 ? 'Booking Cancelled' : `${cancelledBookings.length} Bookings Cancelled`}
              </h3>
              <div className="space-y-2">
                {cancelledBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between text-sm text-red-700 dark:text-red-300">
                    <div className="flex-1">
                      <p className="font-medium">{booking.hotelName}</p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {booking.checkInDate} - {booking.checkOutDate} • Ref: {booking.bookingReference}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDismiss(booking.id)}
                      className="ml-2 p-1 hover:bg-red-100 dark:hover:bg-red-800/30 rounded transition"
                      title="Dismiss"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {cancelledBookings.length > 3 && (
                  <p className="text-xs text-red-600 dark:text-red-400 italic">
                    +{cancelledBookings.length - 3} more cancelled booking{cancelledBookings.length - 3 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                The hotel owner has cancelled {cancelledBookings.length === 1 ? 'this booking' : 'these bookings'}. 
                Please contact support if you have questions.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismissAll}
            className="ml-2 p-1 hover:bg-red-100 dark:hover:bg-red-800/30 rounded transition flex-shrink-0"
            title="Dismiss all"
          >
            <XMarkIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingNotificationBanner;
