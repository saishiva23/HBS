import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
    FaChevronLeft,
    FaChevronRight,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaEdit,
} from 'react-icons/fa';

const PricingAvailability = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedRoomType, setSelectedRoomType] = useState('All Rooms');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ date: '', price: 0, available: true });

    const roomTypes = [
        'All Rooms',
        'Standard Room',
        'Deluxe Suite',
        'Premium Suite',
        'Family Room',
        'Executive Suite',
    ];

    // Mock pricing and availability data
    const [pricingData, setPricingData] = useState({
        '2026-01-22': { price: 450, available: true, booked: 2, total: 5 },
        '2026-01-23': { price: 480, available: true, booked: 3, total: 5 },
        '2026-01-24': { price: 520, available: true, booked: 4, total: 5 },
        '2026-01-25': { price: 550, available: true, booked: 5, total: 5 },
        '2026-01-26': { price: 450, available: false, booked: 0, total: 5 },
        '2026-01-27': { price: 420, available: true, booked: 1, total: 5 },
        '2026-01-28': { price: 400, available: true, booked: 0, total: 5 },
    });

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getPriceForDate = (date) => {
        const dateStr = formatDate(date);
        return pricingData[dateStr] || { price: 400, available: true, booked: 0, total: 5 };
    };

    const handlePreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleDateClick = (date) => {
        if (!date) return;
        setSelectedDate(date);
        const dateStr = formatDate(date);
        const data = pricingData[dateStr] || { price: 400, available: true };
        setEditData({ date: dateStr, price: data.price, available: data.available });
        setShowEditModal(true);
    };

    const handleSavePricing = () => {
        setPricingData({
            ...pricingData,
            [editData.date]: {
                ...pricingData[editData.date],
                price: editData.price,
                available: editData.available,
            },
        });
        setShowEditModal(false);
    };

    const getOccupancyColor = (booked, total) => {
        const percentage = (booked / total) * 100;
        if (percentage === 100) return 'bg-red-500';
        if (percentage >= 75) return 'bg-orange-500';
        if (percentage >= 50) return 'bg-amber-500';
        if (percentage >= 25) return 'bg-blue-500';
        return 'bg-emerald-500';
    };

    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const days = getDaysInMonth(currentMonth);



    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Pricing & Availability Calendar 💵
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your room pricing and availability
                        </p>
                    </div>

                    {/* Room Type Selector */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Select Room Type
                        </label>
                        <select
                            value={selectedRoomType}
                            onChange={(e) => setSelectedRoomType(e.target.value)}
                            className="w-full md:w-auto px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                        >
                            {roomTypes.map(type => (
                                <option key={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Calendar */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                        {/* Calendar Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handlePreviousMonth}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                >
                                    <FaChevronLeft className="h-6 w-6" />
                                </button>
                                <h2 className="text-2xl font-bold">{monthYear}</h2>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                >
                                    <FaChevronRight className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Day Labels */}
                        <div className="grid grid-cols-7 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="px-2 py-3 text-center font-bold text-gray-700 dark:text-gray-300 text-sm">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-slate-700">
                            {days.map((date, index) => {
                                if (!date) {
                                    return <div key={`empty-${index}`} className="bg-gray-50 dark:bg-slate-800 min-h-32"></div>;
                                }

                                const dateData = getPriceForDate(date);
                                const isToday = formatDate(date) === formatDate(new Date());
                                const occupancyPercentage = (dateData.booked / dateData.total) * 100;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleDateClick(date)}
                                        className={`bg-white dark:bg-gray-800 p-3 min-h-32 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all group relative ${isToday ? 'ring-2 ring-blue-500' : ''
                                            }`}
                                    >
                                        {/* Date Number */}
                                        <div className={`text-sm font-bold mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {date.getDate()}
                                        </div>

                                        {/* Price */}
                                        <div className="mb-2">
                                            <div className="text-lg font-bold text-blue-600">
                                                ${dateData.price}
                                            </div>
                                            <div className="text-xs text-gray-500">per night</div>
                                        </div>

                                        {/* Availability */}
                                        <div className="flex items-center justify-center gap-1 mb-2">
                                            {dateData.available ? (
                                                <FaCheckCircle className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <FaTimesCircle className="h-4 w-4 text-red-500" />
                                            )}
                                            <span className={`text-xs font-semibold ${dateData.available ? 'text-emerald-600' : 'text-red-600'
                                                }`}>
                                                {dateData.available ? 'Available' : 'Blocked'}
                                            </span>
                                        </div>

                                        {/* Occupancy Bar */}
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                <span>Occupancy</span>
                                                <span>{dateData.booked}/{dateData.total}</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${getOccupancyColor(dateData.booked, dateData.total)}`}
                                                    style={{ width: `${occupancyPercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Edit Icon (shown on hover) */}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FaEdit className="h-4 w-4 text-emerald-600" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Occupancy Legend</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">0-25% Full</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">25-50% Full</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">50-75% Full</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">75-99% Full</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">100% Full</span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Modal */}
                    {showEditModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
                                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                                    <h2 className="text-xl font-bold">Edit Pricing & Availability</h2>
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                    >
                                        <FaTimesCircle className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Date
                                        </label>
                                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl">
                                            <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {editData.date}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Price per Night
                                        </label>
                                        <div className="relative">
                                            <FaMoneyBillWave className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="number"
                                                value={editData.price}
                                                onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-emerald-500 transition-all"
                                                min="0"
                                                step="10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Availability
                                        </label>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setEditData({ ...editData, available: true })}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${editData.available
                                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700'
                                                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                <FaCheckCircle className="h-5 w-5" />
                                                Available
                                            </button>
                                            <button
                                                onClick={() => setEditData({ ...editData, available: false })}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${!editData.available
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700'
                                                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                <FaTimesCircle className="h-5 w-5" />
                                                Blocked
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={handleSavePricing}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setShowEditModal(false)}
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

export default PricingAvailability;
