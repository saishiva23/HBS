import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
    FaChartBar,
    FaDollarSign,
    FaCalendarAlt,
    FaArrowUp,
    FaArrowDown,
    FaHotel,
    FaStar,
    FaClock,
} from 'react-icons/fa';
import { useHotel } from '../../context/HotelContext';

const HotelierDashboard = () => {
    const [timeRange, setTimeRange] = useState('week');
    const { selectedHotel } = useHotel();

    // Mock data
    const stats = [
        {
            label: 'Total Revenue',
            value: '$45,231',
            change: '+12.5%',
            trend: 'up',
            icon: FaDollarSign,
            gradient: 'from-emerald-500 to-teal-600',
        },
        {
            label: 'Total Bookings',
            value: '342',
            change: '+8.2%',
            trend: 'up',
            icon: FaCalendarAlt,
            gradient: 'from-blue-500 to-indigo-600',
        },
        {
            label: 'Occupancy Rate',
            value: '78%',
            change: '-3.1%',
            trend: 'down',
            icon: FaHotel,
            gradient: 'from-purple-500 to-pink-600',
        },
        {
            label: 'Avg. Rating',
            value: '4.7',
            change: '+0.3',
            trend: 'up',
            icon: FaStar,
            gradient: 'from-amber-500 to-orange-600',
        },
    ];

    const recentBookings = [
        { id: 1, guest: 'John Smith', room: 'Deluxe Suite', checkIn: '2026-01-22', amount: '$450', status: 'Confirmed' },
        { id: 2, guest: 'Emma Johnson', room: 'Standard Room', checkIn: '2026-01-23', amount: '$220', status: 'Pending' },
        { id: 3, guest: 'Michael Brown', room: 'Premium Suite', checkIn: '2026-01-24', amount: '$680', status: 'Confirmed' },
        { id: 4, guest: 'Sarah Davis', room: 'Family Room', checkIn: '2026-01-25', amount: '$390', status: 'Confirmed' },
        { id: 5, guest: 'David Wilson', room: 'Executive Suite', checkIn: '2026-01-26', amount: '$850', status: 'Pending' },
    ];

    const upcomingTasks = [
        { id: 1, task: 'Update room availability for Feb', priority: 'High', time: '2 hours ago' },
        { id: 2, task: 'Respond to 3 new reviews', priority: 'Medium', time: '5 hours ago' },
        { id: 3, task: 'Process refund request', priority: 'High', time: '1 day ago' },
        { id: 4, task: 'Upload new hotel photos', priority: 'Low', time: '2 days ago' },
    ];

    const monthlyData = [
        { month: 'Jan', revenue: 35000, bookings: 280 },
        { month: 'Feb', revenue: 42000, bookings: 320 },
        { month: 'Mar', revenue: 38000, bookings: 295 },
        { month: 'Apr', revenue: 45000, bookings: 340 },
        { month: 'May', revenue: 52000, bookings: 380 },
        { month: 'Jun', revenue: 48000, bookings: 360 },
    ];

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <img
                                src={selectedHotel?.image}
                                alt={selectedHotel?.name}
                                className="h-12 w-12 rounded-xl object-cover shadow-lg"
                            />
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    {selectedHotel?.name} 👋
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {selectedHotel?.location} • {selectedHotel?.totalRooms} Rooms
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Here's what's happening with your property today
                        </p>
                    </div>

                    {/* Time Range Selector */}
                    <div className="mb-6 flex gap-2">
                        {['Today', 'Week', 'Month', 'Year'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range.toLowerCase())}
                                className={`px-4 py-2 rounded-xl font-semibold transition-all ${timeRange === range.toLowerCase()
                                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-yellow-400'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            const TrendIcon = stat.trend === 'up' ? FaArrowUp : FaArrowDown;
                            return (
                                <div
                                    key={index}
                                    className="relative group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700"
                                >
                                    {/* Gradient Background */}
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`}></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                <TrendIcon className="h-4 w-4" />
                                                <span className="text-sm font-semibold">{stat.change}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Charts and Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Revenue Chart */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Overview</h2>
                                <FaChartBar className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="h-64 flex items-end justify-between gap-2">
                                {monthlyData.map((data, index) => {
                                    const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
                                    const height = (data.revenue / maxRevenue) * 100;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg shadow-lg hover:shadow-xl transition-all cursor-pointer relative group"
                                                style={{ height: `${height}%` }}>
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    ${(data.revenue / 1000).toFixed(0)}k
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold">{data.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
                            <div className="space-y-3">
                                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                                    + Add New Room
                                </button>
                                <button className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all">
                                    + Create Booking
                                </button>
                                <button className="w-full px-4 py-3 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                                    Update Pricing
                                </button>
                                <button className="w-full px-4 py-3 border-2 border-yellow-400 text-yellow-600 dark:text-yellow-400 rounded-xl font-semibold hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all">
                                    View Reports
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Bookings and Tasks */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Bookings */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Bookings</h2>
                                <FaCalendarAlt className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="space-y-3">
                                {recentBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-md transition-all"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{booking.guest}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{booking.room}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">{booking.checkIn}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 dark:text-white">{booking.amount}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'Confirmed'
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Tasks */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Tasks</h2>
                                <FaClock className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div className="space-y-3">
                                {upcomingTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-md transition-all"
                                    >
                                        <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300 accent-blue-600" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 dark:text-white">{task.task}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}>
                                                    {task.priority}
                                                </span>
                                                <span className="text-xs text-gray-500">{task.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default HotelierDashboard;
