import { useState } from 'react';
import {
    FaStar,
    FaComments,
    FaExclamationCircle,
    FaCheckCircle,
    FaClock,
    FaSearch,
    FaFilter,
    FaReply,
    FaEllipsisV,
    FaSync
} from 'react-icons/fa';
import OwnerLayout from '../../layouts/OwnerLayout';
import { mockComplaints } from '../../data/experienceData';

const CustomerExperience = () => {
    const [activeTab, setActiveTab] = useState('reviews');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Mock Reviews (derived from earlier data)
    const [reviews, setReviews] = useState([
        { id: 1, guest: 'John Smith', rating: 5, comment: 'Excellent stay!', date: '2026-01-20', status: 'Published', room: 'Deluxe' },
        { id: 2, guest: 'Emma Johnson', rating: 4, comment: 'Great location.', date: '2026-01-18', status: 'Published', room: 'Standard AC' },
        { id: 3, guest: 'Michael Brown', rating: 3, comment: 'Average experience.', date: '2026-01-15', status: 'Pending', room: 'Standard' },
    ]);

    const [complaints, setComplaints] = useState(mockComplaints);

    const stats = [
        { label: 'Overall Rating', value: '4.6/5', icon: FaStar, color: 'from-amber-500 to-orange-600' },
        { label: 'New Reviews', value: '12', icon: FaComments, color: 'from-blue-500 to-indigo-600' },
        { label: 'Pending Complaints', value: '3', icon: FaExclamationCircle, color: 'from-red-500 to-pink-600' },
        { label: 'Resolution Rate', value: '94%', icon: FaCheckCircle, color: 'from-emerald-500 to-teal-600' },
    ];

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'resolved':
            case 'published': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'in progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
        }
    };

    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                    {/* Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                Customer Experience ✨
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                Manage guest feedback and resolve issues in real-time
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all dark:text-white">
                                <FaSync className="h-4 w-4" />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <div key={idx} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 transform hover:scale-105 transition-all">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} w-fit mb-4`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-all ${activeTab === 'reviews' 
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                <FaComments className="h-5 w-5" />
                                Guest Reviews
                            </button>
                            <button
                                onClick={() => setActiveTab('complaints')}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-all ${activeTab === 'complaints' 
                                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white' 
                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                <FaExclamationCircle className="h-5 w-5" />
                                Guest Complaints
                            </button>
                        </div>

                        {/* Search & Filter */}
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder={activeTab === 'reviews' ? "Search guest name or comment..." : "Search complaint ID or issue..."}
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm">
                                    <FaFilter className="h-4 w-4" />
                                    Filter
                                </button>
                            </div>
                        </div>

                        {/* List Area */}
                        <div className="p-6">
                            {activeTab === 'reviews' ? (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="p-6 bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                        {review.guest.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white">{review.guest}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Stayed in {review.room} • {review.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                                                    <FaStar className="h-4 w-4 text-amber-500" />
                                                    <span className="font-bold text-amber-700 dark:text-amber-400">{review.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{review.comment}"</p>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-600">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(review.status)}`}>
                                                    {review.status}
                                                </span>
                                                <div className="flex gap-2">
                                                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                                                        <FaReply className="h-3 w-3" />
                                                        Respond
                                                    </button>
                                                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                        <FaEllipsisV className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {complaints.map((complaint) => (
                                        <div key={complaint.id} className="p-6 bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                                                        complaint.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'
                                                    }`}>
                                                        <FaExclamationCircle className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-gray-900 dark:text-white">{complaint.subject}</h4>
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                                complaint.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                            }`}>
                                                                {complaint.priority} Priority
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Room {complaint.roomNumber} • {complaint.guestName} • {complaint.date}</p>
                                                    </div>
                                                </div>
                                                <div className="text-xs font-bold text-gray-400">
                                                    #{complaint.id}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 mb-4">{complaint.description}</p>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(complaint.status)}`}>
                                                        {complaint.status}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="px-4 py-2 bg-gray-900 dark:bg-gray-600 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors">
                                                        Update Status
                                                    </button>
                                                    <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white hover:bg-gray-50 transition-colors">
                                                        Assign Staff
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default CustomerExperience;
