import { useState, useEffect } from 'react';
import OwnerLayout from '../../layouts/OwnerLayout';
import { useHotel } from '../../context/HotelContext';
import { ownerBookingManagement } from '../../services/completeAPI';
import { useToast } from '../../contexts/ToastContext';
import {
    FaSearch,
    FaFilter,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaBed,
    FaUser,
    FaDollarSign,
} from 'react-icons/fa';

const BookingManagement = () => {
    const { selectedHotel } = useHotel();
    const { showToast } = useToast();
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        if (selectedHotel) {
            fetchBookings();
        }
    }, [selectedHotel]);

    const fetchBookings = async () => {
        if (!selectedHotel) return;

        setIsLoading(true);
        try {
            const response = await ownerBookingManagement.getHotelBookings(selectedHotel.id);
            const data = response.data || response;
            setBookings(data);
            setFilteredBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            showToast('Failed to load bookings: ' + (error.response?.data?.message || error.message), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let result = bookings;

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(b =>
                (b.guestFirstName && b.guestFirstName.toLowerCase().includes(lower)) ||
                (b.guestLastName && b.guestLastName.toLowerCase().includes(lower)) ||
                (b.bookingReference && b.bookingReference.toLowerCase().includes(lower)) ||
                (b.guestEmail && b.guestEmail.toLowerCase().includes(lower))
            );
        }

        if (statusFilter !== 'All') {
            result = result.filter(b => b.status === statusFilter);
        }

        setFilteredBookings(result);
    }, [bookings, searchTerm, statusFilter]);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        if (!window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this booking?`)) {
            return;
        }

        try {
            await ownerBookingManagement.updateStatus(bookingId, newStatus);
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
            showToast(`Booking ${newStatus.toLowerCase()} successfully!`, 'success');
        } catch (error) {
            console.error("Failed to update status", error);
            showToast('Failed to update status: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const stats = [
        {
            label: 'Total Bookings',
            value: bookings.length,
            icon: FaBed,
            color: 'from-blue-500 to-blue-600',
        },
        {
            label: 'Confirmed',
            value: bookings.filter(b => b.status === 'CONFIRMED').length,
            icon: FaCheckCircle,
            color: 'from-green-500 to-green-600',
        },
        {
            label: 'Pending',
            value: bookings.filter(b => b.status === 'PENDING').length,
            icon: FaClock,
            color: 'from-yellow-500 to-yellow-600',
        },
        {
            label: 'Cancelled',
            value: bookings.filter(b => b.status === 'CANCELLED').length,
            icon: FaTimesCircle,
            color: 'from-red-500 to-red-600',
        },
    ];

    const StatusBadge = ({ status }) => {
        const config = {
            CONFIRMED: {
                bg: 'bg-green-500/90',
                text: 'text-white',
                border: 'border-green-400',
            },
            PENDING: {
                bg: 'bg-yellow-500/90',
                text: 'text-white',
                border: 'border-yellow-400',
            },
            CANCELLED: {
                bg: 'bg-red-500/90',
                text: 'text-white',
                border: 'border-red-400',
            },
            COMPLETED: {
                bg: 'bg-blue-500/90',
                text: 'text-white',
                border: 'border-blue-400',
            },
        };

        const style = config[status] || { bg: 'bg-gray-500/90', text: 'text-white', border: 'border-gray-400' };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${style.bg} ${style.text} ${style.border}`}>
                {status}
            </span>
        );
    };

    if (!selectedHotel) {
        return (
            <OwnerLayout>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center">
                    <p className="text-xl text-gray-600 dark:text-gray-400">Please select a hotel first</p>
                </div>
            </OwnerLayout>
        );
    }

    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Booking Management 📅
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage all bookings for {selectedHotel.name}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all border border-gray-100 dark:border-gray-700">
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by guest name, email, or booking reference..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="relative">
                                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-12 pr-8 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all appearance-none"
                                >
                                    <option value="All">All Status</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    {isLoading ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                            <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                            <FaBed className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 text-lg">No bookings found</p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                                {searchTerm || statusFilter !== 'All' ? 'Try adjusting your filters' : 'Bookings will appear here once guests make reservations'}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Guest</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Room & Dates</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {filteredBookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                                            <FaUser className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                                {booking.guestFirstName} {booking.guestLastName}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">{booking.guestEmail}</div>
                                                            <div className="text-xs text-gray-400">{booking.bookingReference}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <FaBed className="h-4 w-4 text-gray-400" />
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-white">{booking.roomTypeName}</div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                                <FaCalendarAlt className="h-3 w-3" />
                                                                {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                                                            </div>
                                                            <div className="text-xs text-gray-400">
                                                                {booking.adults} Adult{booking.adults > 1 ? 's' : ''}, {booking.children} Children, {booking.rooms} Room{booking.rooms > 1 ? 's' : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <FaDollarSign className="h-4 w-4 text-green-600" />
                                                        <div className="font-bold text-gray-900 dark:text-white">
                                                            ₹{booking.totalPrice?.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    {booking.paymentStatus && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Payment: {booking.paymentStatus}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={booking.status} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {booking.status === 'PENDING' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                                                                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                                                                title="Confirm Booking"
                                                            >
                                                                <FaCheckCircle className="h-4 w-4" />
                                                                Confirm
                                                            </button>
                                                        )}
                                                        {booking.status === 'CONFIRMED' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                                                                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                                                title="Mark as Completed"
                                                            >
                                                                <FaCheckCircle className="h-4 w-4" />
                                                                Complete
                                                            </button>
                                                        )}
                                                        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                                                                className="flex items-center gap-1 px-3 py-2 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm font-medium"
                                                                title="Cancel Booking"
                                                            >
                                                                <FaTimesCircle className="h-4 w-4" />
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </OwnerLayout>
    );
};

export default BookingManagement;
