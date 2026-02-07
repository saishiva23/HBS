import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import AccountLayout from '../components/AccountLayout';
import customerAPI from '../services/customerAPI';
import toast from 'react-hot-toast';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'resolved'
    const [expandedId, setExpandedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async () => {
        setLoading(true);
        try {
            const response = await customerAPI.complaints.getMy();
            // Handle both direct array and wrapped response
            const data = response.data || response;
            setComplaints(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load complaints:', error);
            // Don't show toast on initial load - only log error
            setComplaints([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesFilter = filter === 'all' ||
            (filter === 'pending' && c.status === 'PENDING') ||
            (filter === 'resolved' && c.status === 'RESOLVED');

        const matchesSearch = searchTerm === '' ||
            c.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
    const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;

    const getStatusBadge = (status) => {
        if (status === 'RESOLVED') {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                    <CheckCircleIcon className="h-4 w-4" />
                    Resolved
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <ClockIcon className="h-4 w-4" />
                Pending Review
            </span>
        );
    };

    return (
        <AccountLayout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                            <ExclamationTriangleIcon className="h-10 w-10 text-red-500" />
                            My Complaints
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Track and manage your complaints
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Filter Tabs */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    All ({complaints.length})
                                </button>
                                <button
                                    onClick={() => setFilter('pending')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'pending'
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    Pending ({pendingCount})
                                </button>
                                <button
                                    onClick={() => setFilter('resolved')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'resolved'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    Resolved ({resolvedCount})
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative w-full md:w-64">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search complaints..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Complaints List */}
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading complaints...</p>
                        </div>
                    ) : filteredComplaints.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                            <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {searchTerm ? 'No matching complaints' : 'No complaints filed'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {searchTerm
                                    ? 'Try adjusting your search'
                                    : 'You haven\'t filed any complaints yet'}
                            </p>

                            {!searchTerm && (
                                <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                                        How to submit a complaint
                                    </h4>
                                    <ol className="text-left text-sm text-blue-800 dark:text-blue-300 space-y-2 max-w-md mx-auto">
                                        <li>1. Go to <Link to="/bookings" className="underline font-semibold">My Bookings</Link></li>
                                        <li>2. Find the booking you want to report an issue with</li>
                                        <li>3. Click the <strong>"Report Issue"</strong> button</li>
                                        <li>4. Fill out the complaint form with details</li>
                                        <li>5. Track the status and resolution here</li>
                                    </ol>
                                    <Link
                                        to="/bookings"
                                        className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                                    >
                                        Go to My Bookings
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredComplaints.map((complaint) => (
                                <div
                                    key={complaint.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition hover:shadow-xl"
                                >
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {complaint.subject}
                                                    </h3>
                                                    {getStatusBadge(complaint.status)}
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Hotel: {complaint.hotelName || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    Submitted: {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mb-4">
                                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                                Your Complaint:
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {complaint.description}
                                            </p>
                                        </div>

                                        {/* Resolution (if resolved) */}
                                        {complaint.status === 'RESOLVED' && complaint.resolution && (
                                            <div className="mt-4 pt-4 border-t dark:border-gray-700">
                                                <button
                                                    onClick={() => setExpandedId(expandedId === complaint.id ? null : complaint.id)}
                                                    className="flex items-center justify-between w-full text-left"
                                                >
                                                    <span className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                                                        <CheckCircleIcon className="h-5 w-5" />
                                                        Hotel's Response
                                                        {complaint.resolvedAt && (
                                                            <span className="text-xs text-gray-500">
                                                                ({new Date(complaint.resolvedAt).toLocaleDateString()})
                                                            </span>
                                                        )}
                                                    </span>
                                                    {expandedId === complaint.id ? (
                                                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                                                    ) : (
                                                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                                                    )}
                                                </button>

                                                {expandedId === complaint.id && (
                                                    <div className="mt-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                        <p className="text-gray-700 dark:text-gray-300">
                                                            {complaint.resolution}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Link to booking */}
                                        {complaint.bookingId && (
                                            <div className="mt-4">
                                                <Link
                                                    to="/bookings"
                                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    View related booking →
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AccountLayout>
    );
};

export default Complaints;
