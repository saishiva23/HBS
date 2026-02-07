import { useNavigate } from 'react-router-dom';
import { FaHotel, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useHotel } from '../../context/HotelContext';
import { useEffect } from 'react';

const NoHotels = () => {
    const navigate = useNavigate();
    const { hotels, refreshHotels } = useHotel();

    // Auto-redirect if hotels become available
    useEffect(() => {
        if (hotels.length > 0) {
            const allPending = hotels.every(h => h.status === 'PENDING');
            const hasApproved = hotels.some(h => h.status === 'APPROVED');

            if (allPending) {
                navigate('/owner/pending-approval', { replace: true });
            } else if (hasApproved) {
                navigate('/owner/hotel-profile', { replace: true });
            }
        }
    }, [hotels, navigate]);

    return (
        <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-[calc(100vh-80px)] flex flex-col items-center pt-36 pb-12 px-4">
            <div className="max-w-lg w-full">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <FaHotel className="h-10 w-10 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">
                        No Active Hotels
                    </h1>

                    {/* Message */}
                    <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-8">
                        {hotels.length === 0
                            ? "You haven't registered any hotels yet. Start by registering your first property to begin managing bookings and rooms."
                            : "Your hotels may be pending approval or have been temporarily disabled. Click 'Refresh Status' to check for updates or contact support if you believe this is an error."}
                    </p>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/hoteliers')}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <FaPlus className="h-4 w-4" />
                            Register New Hotel
                        </button>

                        <button
                            onClick={refreshHotels}
                            className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                        >
                            Refresh Status
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                        >
                            <FaArrowLeft className="h-4 w-4" />
                            Back to Main Site
                        </button>
                    </div>

                    {/* Help Text */}
                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs text-blue-800 dark:text-blue-300 text-center">
                            <strong>Need help?</strong> Contact our support team at{' '}
                            <a href="mailto:support@stays.in" className="underline hover:text-blue-600">
                                support@stays.in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoHotels;
