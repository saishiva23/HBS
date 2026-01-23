import { useState } from 'react';
import {
    FaStar,
    FaComments,
    FaFilter,
    FaSearch,
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
    FaFlag,
    FaReply,
} from 'react-icons/fa';
import AdminLayout from '../../layouts/AdminLayout';

const ReviewsManagement = () => {
    const [reviews, setReviews] = useState([
        {
            id: 1,
            guestName: 'John Smith',
            guestEmail: 'john@example.com',
            rating: 5,
            title: 'Exceptional Stay!',
            comment: 'The hotel exceeded all our expectations. The staff was incredibly friendly and attentive. The room was spotless and beautifully decorated. Will definitely return!',
            roomType: 'Deluxe Suite',
            stayDate: '2026-01-15',
            reviewDate: '2026-01-18',
            status: 'Published',
            response: null,
            helpful: 12,
        },
        {
            id: 2,
            guestName: 'Emma Johnson',
            guestEmail: 'emma@example.com',
            rating: 4,
            title: 'Great Location',
            comment: 'Perfect location in the city center. Rooms are modern and clean. The only downside was the breakfast could have more variety.',
            roomType: 'Standard Room',
            stayDate: '2026-01-10',
            reviewDate: '2026-01-13',
            status: 'Published',
            response: 'Thank you for your feedback! We\'re working on expanding our breakfast menu.',
            helpful: 8,
        },
        {
            id: 3,
            guestName: 'Michael Brown',
            guestEmail: 'michael@example.com',
            rating: 3,
            title: 'Average Experience',
            comment: 'The hotel is okay but nothing special. Service was slow at times and the WiFi connection was unstable.',
            roomType: 'Premium Suite',
            stayDate: '2026-01-08',
            reviewDate: '2026-01-10',
            status: 'Pending',
            response: null,
            helpful: 3,
        },
        {
            id: 4,
            guestName: 'Sarah Davis',
            guestEmail: 'sarah@example.com',
            rating: 2,
            title: 'Disappointing',
            comment: 'Room was not as described in the photos. Found the bathroom not properly cleaned. Expected better for the price.',
            roomType: 'Family Room',
            stayDate: '2026-01-05',
            reviewDate: '2026-01-07',
            status: 'Flagged',
            response: null,
            helpful: 5,
        },
        {
            id: 5,
            guestName: 'David Wilson',
            guestEmail: 'david@example.com',
            rating: 5,
            title: 'Outstanding Service',
            comment: 'From check-in to check-out, everything was perfect. The concierge went above and beyond to help us plan our stay. Highly recommend!',
            roomType: 'Executive Suite',
            stayDate: '2026-01-12',
            reviewDate: '2026-01-16',
            status: 'Published',
            response: 'We\'re thrilled you had such a wonderful experience! Thank you for the kind words.',
            helpful: 15,
        },
    ]);

    const [filterRating, setFilterRating] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReview, setSelectedReview] = useState(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseText, setResponseText] = useState('');

    const ratingFilters = ['All', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'];
    const statusFilters = ['All', 'Published', 'Pending', 'Flagged'];

    const filteredReviews = reviews.filter(review => {
        const matchesSearch =
            review.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRating = filterRating === 'All' ||
            (filterRating.includes(review.rating.toString()));

        const matchesStatus = filterStatus === 'All' || review.status === filterStatus;

        return matchesSearch && matchesRating && matchesStatus;
    });

    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
    };

    const updateReviewStatus = (id, status) => {
        setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
    };

    const handleRespond = (review) => {
        setSelectedReview(review);
        setResponseText(review.response || '');
        setShowResponseModal(true);
    };

    const saveResponse = () => {
        setReviews(reviews.map(r =>
            r.id === selectedReview.id ? { ...r, response: responseText } : r
        ));
        setShowResponseModal(false);
        setResponseText('');
        setSelectedReview(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Published': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-300';
            case 'Flagged': return 'bg-red-100 text-red-700 border-red-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={`h-5 w-5 ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    const stats = [
        {
            label: 'Total Reviews',
            value: reviews.length,
            color: 'from-blue-500 to-indigo-600',
            icon: FaComments,
        },
        {
            label: 'Average Rating',
            value: averageRating.toFixed(1),
            color: 'from-amber-500 to-orange-600',
            icon: FaStar,
        },
        {
            label: 'Published',
            value: reviews.filter(r => r.status === 'Published').length,
            color: 'from-emerald-500 to-teal-600',
            icon: FaCheckCircle,
        },
        {
            label: 'Pending Review',
            value: reviews.filter(r => r.status === 'Pending').length,
            color: 'from-purple-500 to-pink-600',
            icon: FaEye,
        },
    ];

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-orange-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                            Reviews Management ⭐
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Monitor and respond to guest reviews
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all">
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Rating Distribution */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Rating Distribution</h2>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = ratingDistribution[rating];
                                const percentage = (count / reviews.length) * 100;
                                return (
                                    <div key={rating} className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 w-20">
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{rating}</span>
                                            <FaStar className="h-4 w-4 text-amber-400" />
                                        </div>
                                        <div className="flex-1 h-6 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-12 text-right">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search reviews..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-amber-500 transition-all"
                                />
                            </div>

                            <div className="flex gap-4">
                                <select
                                    value={filterRating}
                                    onChange={(e) => setFilterRating(e.target.value)}
                                    className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-amber-500 transition-all"
                                >
                                    {ratingFilters.map(filter => (
                                        <option key={filter}>{filter}</option>
                                    ))}
                                </select>

                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-amber-500 transition-all"
                                >
                                    {statusFilters.map(filter => (
                                        <option key={filter}>{filter}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                                                    {review.guestName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white">{review.guestName}</h3>
                                                    <p className="text-sm text-gray-500">{review.guestEmail}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="mb-2">{renderStars(review.rating)}</div>
                                            <p className="text-xs text-gray-500">Reviewed on {review.reviewDate}</p>
                                        </div>
                                    </div>

                                    {/* Review Content */}
                                    <div className="mb-4">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{review.title}</h4>
                                        <p className="text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>Room: {review.roomType}</span>
                                            <span>•</span>
                                            <span>Stayed: {review.stayDate}</span>
                                            <span>•</span>
                                            <span>{review.helpful} found this helpful</span>
                                        </div>
                                    </div>

                                    {/* Response */}
                                    {review.response && (
                                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 mb-4">
                                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                                                Hotel Response:
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300">{review.response}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(review.status)}`}>
                                                {review.status}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRespond(review)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                            >
                                                <FaReply className="h-4 w-4" />
                                                {review.response ? 'Edit Response' : 'Respond'}
                                            </button>

                                            {review.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateReviewStatus(review.id, 'Published')}
                                                        className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-all"
                                                        title="Publish"
                                                    >
                                                        <FaCheckCircle className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => updateReviewStatus(review.id, 'Flagged')}
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                                        title="Flag"
                                                    >
                                                        <FaFlag className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Response Modal */}
                    {showResponseModal && selectedReview && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full">
                                <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                                    <h2 className="text-xl font-bold">Respond to Review</h2>
                                    <button
                                        onClick={() => setShowResponseModal(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                    >
                                        <FaTimesCircle className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Original Review */}
                                    <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            {renderStars(selectedReview.rating)}
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                by {selectedReview.guestName}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{selectedReview.title}</h4>
                                        <p className="text-gray-700 dark:text-gray-300">{selectedReview.comment}</p>
                                    </div>

                                    {/* Response Textarea */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Your Response
                                        </label>
                                        <textarea
                                            value={responseText}
                                            onChange={(e) => setResponseText(e.target.value)}
                                            rows="6"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-amber-500 transition-all"
                                            placeholder="Write your response to the guest..."
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={saveResponse}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                        >
                                            Save Response
                                        </button>
                                        <button
                                            onClick={() => setShowResponseModal(false)}
                                            className="px-6 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default ReviewsManagement;
