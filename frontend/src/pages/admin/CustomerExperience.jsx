import { useState, useEffect } from 'react';
import OwnerLayout from '../../layouts/OwnerLayout';
import { useHotel } from '../../context/HotelContext';
import { ownerCustomerExperience } from '../../services/completeAPI';
import {
    FaStar,
    FaCommentDots,
    FaExclamationCircle,
    FaCheckCircle,
    FaSearch,
    FaFilter,
    FaReply,
    FaUser,
    FaCalendarAlt,
    FaEnvelope
} from 'react-icons/fa';

const CustomerExperience = () => {
    const { selectedHotel } = useHotel();
    const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'complaints'
    const [reviews, setReviews] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({
        overallRating: 0,
        newReviews: 0,
        pendingComplaints: 0,
        resolutionRate: 0
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [resolvingId, setResolvingId] = useState(null);
    const [resolutionText, setResolutionText] = useState('');

    useEffect(() => {
        if (selectedHotel) {
            fetchData();
        }
    }, [selectedHotel]);

    const fetchData = async () => {
        if (!selectedHotel) return;
        setLoading(true);
        try {
            // Fetch stats, reviews, and complaints concurrently
            const [reviewsData, statsData, complaintsData] = await Promise.all([
                ownerCustomerExperience.getHotelReviews(selectedHotel.id),
                ownerCustomerExperience.getReviewStats(selectedHotel.id),
                ownerCustomerExperience.getHotelComplaints(selectedHotel.id)
            ]);

            const rData = reviewsData.data || reviewsData;
            const sData = statsData.data || statsData;
            const cData = complaintsData.data || complaintsData;

            setReviews(rData);
            setComplaints(cData);

            // Calculate resolution rate
            const resolvedCount = cData.filter(c => c.status === 'RESOLVED').length;
            const totalComplaints = cData.length;
            const rate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 100;

            setStats({
                overallRating: sData.averageRating || 0,
                newReviews: sData.newReviews || 0,
                pendingComplaints: cData.filter(c => c.status === 'PENDING').length,
                resolutionRate: rate
            });

        } catch (error) {
            console.error("Failed to fetch customer experience data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolveComplaint = async () => {
        if (!resolutionText.trim()) return;

        try {
            await ownerCustomerExperience.resolveComplaint(resolvingId, resolutionText);

            // Update local state
            setComplaints(prev => prev.map(c =>
                c.id === resolvingId
                    ? { ...c, status: 'RESOLVED', resolution: resolutionText, resolvedAt: new Date().toISOString() }
                    : c
            ));

            // Update stats (optimistic)
            setStats(prev => ({
                ...prev,
                pendingComplaints: prev.pendingComplaints - 1
            }));

            // Reset modal
            setResolvingId(null);
            setResolutionText('');
            alert('Complaint resolved successfully');
        } catch (error) {
            console.error("Failed to resolve complaint", error);
            alert('Failed to resolve complaint');
        }
    };

    const filteredReviews = reviews.filter(r =>
        r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredComplaints = complaints.filter(c =>
        c.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!selectedHotel) {
        return (
            <OwnerLayout>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <p className="text-xl text-gray-600 dark:text-gray-400">Please select a hotel first</p>
                </div>
            </OwnerLayout>
        );
    }

    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 p-4 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
                                Customer Experience <span className="text-2xl">✨</span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Manage guest feedback and resolve issues in real-time
                            </p>
                        </div>
                        <button
                            onClick={fetchData}
                            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700"
                        >
                            Refresh
                        </button>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 mb-4">
                                <FaStar className="w-6 h-6" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Overall Rating</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.overallRating}/5</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mb-4">
                                <FaCommentDots className="w-6 h-6" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">New Reviews</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.newReviews}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 mb-4">
                                <FaExclamationCircle className="w-6 h-6" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Complaints</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.pendingComplaints}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 mb-4">
                                <FaCheckCircle className="w-6 h-6" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Resolution Rate</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.resolutionRate}%</p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`flex-1 py-4 text-center font-semibold transition-colors relative ${activeTab === 'reviews'
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <FaCommentDots />
                                    Guest Reviews
                                </div>
                                {activeTab === 'reviews' && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('complaints')}
                                className={`flex-1 py-4 text-center font-semibold transition-colors relative ${activeTab === 'complaints'
                                        ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <FaExclamationCircle />
                                    Guest Complaints
                                </div>
                                {activeTab === 'complaints' && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-t-full" />
                                )}
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab === 'reviews' ? 'reviews' : 'complaints'}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                                <FaFilter /> Filter
                            </button>
                        </div>

                        {/* Lists */}
                        <div className="p-6">
                            {loading ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Loading...</p>
                                </div>
                            ) : activeTab === 'reviews' ? (
                                <div className="space-y-6">
                                    {filteredReviews.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FaCommentDots className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500">No reviews found matching your search</p>
                                        </div>
                                    ) : (
                                        filteredReviews.map((review) => (
                                            <div key={review.id} className="bg-white dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                            {review.guestName ? review.guestName.charAt(0) : 'G'}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 dark:text-white">{review.guestName}</h3>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                                <FaCalendarAlt className="w-3 h-3" />
                                                                {new Date(review.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                                                        <FaStar className="text-orange-500 w-4 h-4 mr-1" />
                                                        <span className="font-bold text-orange-700 dark:text-orange-400">{review.rating}</span>
                                                    </div>
                                                </div>
                                                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">{review.title}</h4>
                                                <p className="text-gray-600 dark:text-gray-400 italic">"{review.comment}"</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {filteredComplaints.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FaExclamationCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500">No complaints found matching your search</p>
                                        </div>
                                    ) : (
                                        filteredComplaints.map((complaint) => (
                                            <div key={complaint.id} className="bg-white dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                                                            {complaint.guestName ? complaint.guestName.charAt(0) : 'G'}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 dark:text-white">{complaint.guestName}</h3>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                                <FaEnvelope className="w-3 h-3" />
                                                                {complaint.guestEmail}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${complaint.status === 'RESOLVED'
                                                            ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                                            : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                                                        }`}>
                                                        {complaint.status}
                                                    </span>
                                                </div>

                                                <div className="mb-4">
                                                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-1">{complaint.subject}</h4>
                                                    <p className="text-gray-600 dark:text-gray-400">{complaint.description}</p>
                                                    <p className="text-xs text-gray-400 mt-2">Submitted: {new Date(complaint.createdAt).toLocaleString()}</p>
                                                </div>

                                                {complaint.status === 'RESOLVED' ? (
                                                    <div className="mt-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-lg p-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <FaCheckCircle className="text-green-500" />
                                                            <span className="font-bold text-green-700 dark:text-green-400 text-sm">Resolution</span>
                                                        </div>
                                                        <p className="text-gray-700 dark:text-gray-300 text-sm">{complaint.resolution}</p>
                                                    </div>
                                                ) : (
                                                    <div className="mt-4 flex justify-end">
                                                        <button
                                                            onClick={() => setResolvingId(complaint.id)}
                                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 text-sm font-medium"
                                                        >
                                                            <FaCheckCircle /> Resolve Complaint
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resolve Complaint Modal */}
                {resolvingId && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 transform scale-100 transition-all">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Resolve Complaint</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Please describe the action taken to resolve this customer's issue.
                            </p>
                            <textarea
                                value={resolutionText}
                                onChange={(e) => setResolutionText(e.target.value)}
                                placeholder="Enter resolution details..."
                                className="w-full h-32 p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none mb-6 resize-none"
                            ></textarea>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setResolvingId(null);
                                        setResolutionText('');
                                    }}
                                    className="px-5 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResolveComplaint}
                                    disabled={!resolutionText.trim()}
                                    className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Mark as Resolved
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </OwnerLayout>
    );
};

export default CustomerExperience;
