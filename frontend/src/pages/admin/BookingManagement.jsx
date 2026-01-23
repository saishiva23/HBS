import { useState } from 'react';
import {
    FaCalendarAlt,
    FaUser,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaEdit,
    FaTrash,
    FaSearch,
    FaFilter,
    FaEye,
    FaMoneyBillWave,
    FaBed,
    FaPhone,
    FaEnvelope,
    FaPlus,
    FaTimes,
    FaUserPlus,
} from 'react-icons/fa';
import AdminLayout from '../../layouts/AdminLayout';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([
        {
            id: 1,
            bookingRef: 'BK-2026-001',
            guestName: 'John Smith',
            guestEmail: 'john@example.com',
            guestPhone: '+1 555-0123',
            roomNumber: '101',
            roomType: 'Deluxe Suite',
            checkIn: '2026-01-22',
            checkOut: '2026-01-25',
            nights: 3,
            guests: 2,
            amount: 1350,
            status: 'Confirmed',
            paymentStatus: 'Paid',
            specialRequests: 'Late check-in requested',
        },
        {
            id: 2,
            bookingRef: 'BK-2026-002',
            guestName: 'Emma Johnson',
            guestEmail: 'emma@example.com',
            guestPhone: '+1 555-0124',
            roomNumber: '102',
            roomType: 'Standard Room',
            checkIn: '2026-01-23',
            checkOut: '2026-01-26',
            nights: 3,
            guests: 2,
            amount: 660,
            status: 'Pending',
            paymentStatus: 'Pending',
            specialRequests: 'Non-smoking room',
        },
        {
            id: 3,
            bookingRef: 'BK-2026-003',
            guestName: 'Michael Brown',
            guestEmail: 'michael@example.com',
            guestPhone: '+1 555-0125',
            roomNumber: '201',
            roomType: 'Premium Suite',
            checkIn: '2026-01-24',
            checkOut: '2026-01-28',
            nights: 4,
            guests: 4,
            amount: 2720,
            status: 'Confirmed',
            paymentStatus: 'Paid',
            specialRequests: 'Extra towels needed',
        },
        {
            id: 4,
            bookingRef: 'BK-2026-004',
            guestName: 'Sarah Davis',
            guestEmail: 'sarah@example.com',
            guestPhone: '+1 555-0126',
            roomNumber: '202',
            roomType: 'Family Room',
            checkIn: '2026-01-25',
            checkOut: '2026-01-27',
            nights: 2,
            guests: 4,
            amount: 780,
            status: 'Cancelled',
            paymentStatus: 'Refunded',
            specialRequests: 'Baby cot required',
        },
        {
            id: 5,
            bookingRef: 'BK-2026-005',
            guestName: 'David Wilson',
            guestEmail: 'david@example.com',
            guestPhone: '+1 555-0127',
            roomNumber: '301',
            roomType: 'Executive Suite',
            checkIn: '2026-01-26',
            checkOut: '2026-01-30',
            nights: 4,
            guests: 2,
            amount: 3400,
            status: 'Checked-In',
            paymentStatus: 'Paid',
            specialRequests: 'Airport pickup service',
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Available room types and rooms for booking
    const roomTypes = [
        { type: 'Standard Room', pricePerNight: 220, rooms: ['102', '103', '105'] },
        { type: 'Deluxe Suite', pricePerNight: 450, rooms: ['101', '106'] },
        { type: 'Premium Suite', pricePerNight: 680, rooms: ['201', '203'] },
        { type: 'Family Room', pricePerNight: 390, rooms: ['202', '204'] },
        { type: 'Executive Suite', pricePerNight: 850, rooms: ['301', '302'] },
    ];

    const [newBooking, setNewBooking] = useState({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        roomType: 'Standard Room',
        roomNumber: '102',
        checkIn: '',
        checkOut: '',
        guests: 1,
        paymentStatus: 'Pending',
        specialRequests: '',
    });

    const statusOptions = ['All', 'Confirmed', 'Pending', 'Checked-In', 'Checked-Out', 'Cancelled'];

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.roomNumber.includes(searchTerm);
        const matchesFilter = filterStatus === 'All' || booking.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-300';
            case 'Checked-In': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
            case 'Checked-Out': return 'bg-gray-100 text-gray-700 border-gray-300';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-700';
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'Refunded': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const updateBookingStatus = (id, newStatus) => {
        setBookings(bookings.map(booking =>
            booking.id === id ? { ...booking, status: newStatus } : booking
        ));
    };

    const deleteBooking = (id) => {
        if (confirm('Are you sure you want to delete this booking?')) {
            setBookings(bookings.filter(booking => booking.id !== id));
        }
    };

    const viewDetails = (booking) => {
        setSelectedBooking(booking);
        setShowDetailsModal(true);
    };

    // Generate a unique booking reference
    const generateBookingRef = () => {
        const year = new Date().getFullYear();
        const nextId = bookings.length > 0
            ? Math.max(...bookings.map(b => parseInt(b.bookingRef.split('-')[2]))) + 1
            : 1;
        return `BK-${year}-${String(nextId).padStart(3, '0')}`;
    };

    // Calculate nights between two dates
    const calculateNights = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = end - start;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Handle room type change
    const handleRoomTypeChange = (type) => {
        const selectedType = roomTypes.find(rt => rt.type === type);
        setNewBooking({
            ...newBooking,
            roomType: type,
            roomNumber: selectedType?.rooms[0] || '',
        });
    };

    // Create new booking
    const createBooking = () => {
        // Validation
        if (!newBooking.guestName || !newBooking.guestEmail || !newBooking.guestPhone ||
            !newBooking.checkIn || !newBooking.checkOut) {
            alert('Please fill in all required fields');
            return;
        }

        const nights = calculateNights(newBooking.checkIn, newBooking.checkOut);
        if (nights <= 0) {
            alert('Check-out date must be after check-in date');
            return;
        }

        const selectedRoomType = roomTypes.find(rt => rt.type === newBooking.roomType);
        const totalAmount = nights * (selectedRoomType?.pricePerNight || 0);

        const booking = {
            id: Math.max(...bookings.map(b => b.id), 0) + 1,
            bookingRef: generateBookingRef(),
            guestName: newBooking.guestName,
            guestEmail: newBooking.guestEmail,
            guestPhone: newBooking.guestPhone,
            roomNumber: newBooking.roomNumber,
            roomType: newBooking.roomType,
            checkIn: newBooking.checkIn,
            checkOut: newBooking.checkOut,
            nights: nights,
            guests: newBooking.guests,
            amount: totalAmount,
            status: 'Confirmed',
            paymentStatus: newBooking.paymentStatus,
            specialRequests: newBooking.specialRequests,
        };

        setBookings([booking, ...bookings]);
        setShowCreateModal(false);

        // Reset form
        setNewBooking({
            guestName: '',
            guestEmail: '',
            guestPhone: '',
            roomType: 'Standard Room',
            roomNumber: '102',
            checkIn: '',
            checkOut: '',
            guests: 1,
            paymentStatus: 'Pending',
            specialRequests: '',
        });

        alert(`Booking created successfully! Reference: ${booking.bookingRef}`);
    };

    const stats = [
        {
            label: 'Total Bookings',
            value: bookings.length,
            color: 'from-blue-500 to-indigo-600',
            icon: FaCalendarAlt,
        },
        {
            label: 'Confirmed',
            value: bookings.filter(b => b.status === 'Confirmed').length,
            color: 'from-emerald-500 to-teal-600',
            icon: FaCheckCircle,
        },
        {
            label: 'Pending',
            value: bookings.filter(b => b.status === 'Pending').length,
            color: 'from-amber-500 to-orange-600',
            icon: FaClock,
        },
        {
            label: 'Checked-In',
            value: bookings.filter(b => b.status === 'Checked-In').length,
            color: 'from-purple-500 to-pink-600',
            icon: FaUser,
        },
    ];


    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                Booking Management 📅
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage all your hotel reservations
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl shadow-lg hover:from-amber-600 hover:to-yellow-600 transform hover:scale-105 transition-all"
                        >
                            <FaUserPlus className="h-5 w-5" />
                            Create Booking
                        </button>
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

                    {/* Search and Filter */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by booking ref, guest name, or room number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="relative">
                                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-12 pr-8 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all appearance-none"
                                >
                                    {statusOptions.map(status => (
                                        <option key={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Booking Ref</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Guest</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Room</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Check-in</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Check-out</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Amount</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-blue-600">{booking.bookingRef}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{booking.guestName}</p>
                                                    <p className="text-sm text-gray-500">{booking.guestEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">Room {booking.roomNumber}</p>
                                                    <p className="text-sm text-gray-500">{booking.roomType}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">{booking.checkIn}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">{booking.checkOut}</td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">${booking.amount}</p>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                                        {booking.paymentStatus}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(booking.status)} cursor-pointer`}
                                                >
                                                    {statusOptions.filter(s => s !== 'All').map(status => (
                                                        <option key={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => viewDetails(booking)}
                                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                                                        title="View Details"
                                                    >
                                                        <FaEye className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteBooking(booking.id)}
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                                        title="Delete"
                                                    >
                                                        <FaTrash className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Details Modal */}
                    {showDetailsModal && selectedBooking && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                                    <h2 className="text-2xl font-bold">Booking Details</h2>
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                    >
                                        <FaTimesCircle className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Booking Reference */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Booking Reference</p>
                                        <p className="text-2xl font-bold text-blue-600">{selectedBooking.bookingRef}</p>
                                    </div>

                                    {/* Guest Information */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Guest Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                <FaUser className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Name</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.guestName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                <FaEnvelope className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Email</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.guestEmail}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                <FaPhone className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Phone</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.guestPhone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                <FaUser className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Guests</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.guests} Guests</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Booking Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                <FaBed className="h-5 w-5 text-yellow-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Room</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">Room {selectedBooking.roomNumber} - {selectedBooking.roomType}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                <FaCalendarAlt className="h-5 w-5 text-yellow-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Duration</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.nights} Nights</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                <FaCalendarAlt className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Check-in</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.checkIn}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                <FaCalendarAlt className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Check-out</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.checkOut}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Information */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Payment Information</h3>
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                                                <p className="text-3xl font-bold text-gray-900 dark:text-white">${selectedBooking.amount}</p>
                                            </div>
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                                                {selectedBooking.paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Special Requests */}
                                    {selectedBooking.specialRequests && (
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Special Requests</h3>
                                            <p className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-gray-900 dark:text-white border border-yellow-200 dark:border-yellow-800">
                                                {selectedBooking.specialRequests}
                                            </p>
                                        </div>
                                    )}

                                    {/* Status */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Booking Status:</span>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(selectedBooking.status)}`}>
                                            {selectedBooking.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Create Booking Modal */}
                    {showCreateModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                                    <div className="flex items-center gap-3">
                                        <FaUserPlus className="h-6 w-6" />
                                        <h2 className="text-2xl font-bold">Create New Booking</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                    >
                                        <FaTimes className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Guest Information Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <FaUser className="text-blue-500" />
                                            Guest Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Guest Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newBooking.guestName}
                                                    onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })}
                                                    placeholder="Enter guest name"
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    value={newBooking.guestEmail}
                                                    onChange={(e) => setNewBooking({ ...newBooking, guestEmail: e.target.value })}
                                                    placeholder="guest@email.com"
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Phone *
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={newBooking.guestPhone}
                                                    onChange={(e) => setNewBooking({ ...newBooking, guestPhone: e.target.value })}
                                                    placeholder="+1 555-0000"
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Number of Guests
                                                </label>
                                                <select
                                                    value={newBooking.guests}
                                                    onChange={(e) => setNewBooking({ ...newBooking, guests: parseInt(e.target.value) })}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                >
                                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                                        <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Room Selection Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <FaBed className="text-yellow-500" />
                                            Room Selection
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Room Type
                                                </label>
                                                <select
                                                    value={newBooking.roomType}
                                                    onChange={(e) => handleRoomTypeChange(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                >
                                                    {roomTypes.map(rt => (
                                                        <option key={rt.type} value={rt.type}>
                                                            {rt.type} (${rt.pricePerNight}/night)
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Room Number
                                                </label>
                                                <select
                                                    value={newBooking.roomNumber}
                                                    onChange={(e) => setNewBooking({ ...newBooking, roomNumber: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                >
                                                    {roomTypes.find(rt => rt.type === newBooking.roomType)?.rooms.map(room => (
                                                        <option key={room} value={room}>Room {room}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date Selection Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <FaCalendarAlt className="text-blue-500" />
                                            Stay Duration
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Check-in Date *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={newBooking.checkIn}
                                                    onChange={(e) => setNewBooking({ ...newBooking, checkIn: e.target.value })}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Check-out Date *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={newBooking.checkOut}
                                                    onChange={(e) => setNewBooking({ ...newBooking, checkOut: e.target.value })}
                                                    min={newBooking.checkIn || new Date().toISOString().split('T')[0]}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Price Preview */}
                                        {newBooking.checkIn && newBooking.checkOut && calculateNights(newBooking.checkIn, newBooking.checkOut) > 0 && (
                                            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {calculateNights(newBooking.checkIn, newBooking.checkOut)} night(s) × ${roomTypes.find(rt => rt.type === newBooking.roomType)?.pricePerNight}/night
                                                        </p>
                                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                            Total: ${calculateNights(newBooking.checkIn, newBooking.checkOut) * (roomTypes.find(rt => rt.type === newBooking.roomType)?.pricePerNight || 0)}
                                                        </p>
                                                    </div>
                                                    <FaMoneyBillWave className="h-8 w-8 text-emerald-500" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Payment & Additional Info */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <FaMoneyBillWave className="text-emerald-500" />
                                            Payment & Additional Info
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Payment Status
                                                </label>
                                                <select
                                                    value={newBooking.paymentStatus}
                                                    onChange={(e) => setNewBooking({ ...newBooking, paymentStatus: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Paid">Paid</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Special Requests (Optional)
                                                </label>
                                                <textarea
                                                    value={newBooking.specialRequests}
                                                    onChange={(e) => setNewBooking({ ...newBooking, specialRequests: e.target.value })}
                                                    placeholder="Any special requests or notes..."
                                                    rows="3"
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => setShowCreateModal(false)}
                                            className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={createBooking}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-yellow-600 shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                                        >
                                            <FaCheckCircle className="h-5 w-5" />
                                            Create Booking
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

export default BookingManagement;
