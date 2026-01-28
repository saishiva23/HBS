import { useNavigate } from 'react-router-dom';
import { FaHotel, FaClock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useHotel } from '../../context/HotelContext';

const PendingApproval = () => {
    const navigate = useNavigate();
    const { selectedHotel, hotels, loading, refreshHotels } = useHotel();

    // Check if all hotels are pending
    const allPending = hotels.every(h => h.status === 'PENDING');
    const approvedHotels = hotels.filter(h => h.status === 'APPROVED');

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-[calc(100vh-80px)] flex flex-col items-center pt-36 pb-12 px-4">
            <div className="max-w-lg w-full">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
                            <FaClock className="h-6 w-6 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                        Pending Admin Approval
                    </h1>

                    {/* Message */}
                    <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-6">
                        Thank you for registering your hotel{hotels.length > 1 ? 's' : ''} with us!
                    </p>

                    {/* Hotel Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <FaHotel className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                                    {selectedHotel?.name || 'Your Hotel'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                                    <strong>Location:</strong> {selectedHotel?.location || selectedHotel?.address}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-xs">
                                    <strong>Status:</strong>{' '}
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                        <FaClock className="h-2.5 w-2.5 mr-1" />
                                        Pending Review
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What's Next */}
                    <div className="space-y-3 mb-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-base flex items-center gap-2">
                            <FaCheckCircle className="h-4 w-4 text-green-600" />
                            What Happens Next?
                        </h3>
                        <ol className="space-y-2 text-gray-600 dark:text-gray-300 text-xs">
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                                <span>Our admin team will review your hotel registration details</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                                <span>We'll verify the information and check for completeness</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                                <span>Once approved, you'll be able to manage your hotel</span>
                            </li>
                        </ol>
                    </div>

                    {/* Expected Time */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-3 mb-6 rounded-r">
                        <p className="text-xs text-yellow-800 dark:text-yellow-300">
                            <strong>Expected Review Time:</strong> 24-48 hours
                        </p>
                    </div>

                    {/* Check Status Button */}
                    <div className="mb-4">
                        <button
                            onClick={refreshHotels}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Checking...
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle className="h-4 w-4" />
                                    Check Approval Status
                                </>
                            )}
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {approvedHotels.length > 0 && (
                            <button
                                onClick={() => navigate('/owner/hotel-profile')}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                            >
                                View Approved Hotels
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                        >
                            <FaArrowLeft className="h-3 w-3" />
                            Back to Main Site
                        </button>
                    </div>

                    {/* Contact Support */}
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                        Questions? Contact our support team at{' '}
                        <a href="mailto:support@stays.in" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            support@stays.in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PendingApproval;
