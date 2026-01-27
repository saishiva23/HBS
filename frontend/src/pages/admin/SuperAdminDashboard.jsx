import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminAPI } from '../../services/completeAPI';
import {
    FaUsers,
    FaHotel,
    FaChartLine,
    FaClipboardList,
    FaExclamationTriangle,
    FaCheckCircle,
    FaCog,
    FaMapMarkerAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState([
        {
            label: 'Total Users',
            value: 'Loading...',
            icon: FaUsers,
            gradient: 'from-blue-500 to-indigo-600',
            link: '/admin/customers', // Updated link
        },
        {
            label: 'Total Revenue',
            value: 'Loading...',
            icon: FaChartLine, // Changed icon
            gradient: 'from-green-500 to-emerald-600',
            link: '/admin/payments', // Updated link
        },
        {
            label: 'Pending Approvals',
            value: 'Loading...',
            icon: FaClipboardList,
            gradient: 'from-amber-500 to-orange-600',
            link: '/admin/approvals', // Updated link
        },
    ]);
    
    // Quick actions (Updated links)
    const quickActions = [
        { label: 'Approve Hotels', icon: FaCheckCircle, link: '/admin/approvals', color: 'from-blue-600 to-blue-700' }, // Updated link
        { label: 'Platform Stats', icon: FaChartLine, link: '/admin/analytics', color: 'from-emerald-600 to-emerald-700' }, // Updated link
    ];

    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]); // Can't easily mock this from current APIs without a Logs endpoint

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [users, payments, pendingHotels, recentCustomers, recentHotels] = await Promise.all([
                adminAPI.getAllUsers(),
                adminAPI.getAllPayments(),
                adminAPI.getPendingHotels(),
                adminAPI.getRecentCustomers(),
                adminAPI.getRecentHotels()
            ]);

            const totalRevenue = payments.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
            
            setStats([
                {
                    label: 'Total Users',
                    value: users.length.toString(),
                    icon: FaUsers,
                    gradient: 'from-blue-500 to-indigo-600',
                    link: '/admin/customers',
                },
                {
                    label: 'Total Revenue',
                    value: `₹${totalRevenue.toLocaleString()}`,
                    icon: FaChartLine,
                    gradient: 'from-green-500 to-emerald-600',
                    link: '/admin/payments',
                },
                {
                    label: 'Pending Approvals',
                    value: pendingHotels.length.toString(),
                    icon: FaClipboardList,
                    gradient: 'from-amber-500 to-orange-600',
                    link: '/admin/approvals',
                },
            ]);

            // Set pending approvals for the list
            setPendingApprovals(pendingHotels.slice(0, 3).map(h => ({
                id: h.id,
                name: h.name,
                location: `${h.city}, ${h.state}`,
                owner: h.owner ? `${h.owner.firstName} ${h.owner.lastName}` : 'Unknown',
                date: new Date().toISOString().split('T')[0]
            })));

            // Combine and map recent activities
            const recentCustomerActivities = recentCustomers.map(u => ({
                id: `u-${u.id}`,
                action: 'New Customer Joined',
                hotel: null,
                user: `${u.firstName} ${u.lastName}`,
                time: 'Recently',
                type: 'user'
            }));

            const recentHotelActivities = recentHotels.map(h => ({
                id: `h-${h.id}`,
                action: 'New Hotel Registered',
                hotel: h.name,
                user: h.owner ? `${h.owner.firstName} ${h.owner.lastName}` : 'Owner',
                time: 'Recently',
                type: 'hotel'
            }));

            // Interleave or just concat (Customers first then Hotels)
            setRecentActivities([...recentHotelActivities, ...recentCustomerActivities].slice(0, 5));

        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Admin Dashboard 🛡️
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage hotels, users, and platform analytics
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <Link
                                    to={stat.link}
                                    key={index}
                                    className="relative group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700"
                                >
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`}></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        to={action.link}
                                        key={index}
                                        className={`p-4 bg-gradient-to-r ${action.color} rounded-xl text-white font-semibold flex items-center gap-3 hover:shadow-lg transition-all transform hover:-translate-y-0.5`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {action.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pending Approvals */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pending Approvals</h2>
                                <Link to="/superadmin/approvals" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold">
                                    View All →
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {pendingApprovals.map((hotel) => (
                                    <div
                                        key={hotel.id}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-amber-50 dark:from-gray-700 dark:to-gray-600 rounded-xl"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{hotel.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{hotel.location} • {hotel.owner}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                                                Approve
                                            </button>
                                            <button className="px-3 py-1.5 border border-red-400 text-red-600 dark:text-red-400 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                                <Link to="/admin/logs" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold">
                                    View Logs →
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <div className={`p-2 rounded-lg ${
                                            activity.type === 'hotel' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                            activity.type === 'complaint' ? 'bg-red-100 dark:bg-red-900/30' :
                                            activity.type === 'approval' ? 'bg-green-100 dark:bg-green-900/30' :
                                            activity.type === 'removal' ? 'bg-gray-100 dark:bg-gray-700' :
                                            'bg-purple-100 dark:bg-purple-900/30'
                                        }`}>
                                            {activity.type === 'hotel' && <FaHotel className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                                            {activity.type === 'complaint' && <FaExclamationTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />}
                                            {activity.type === 'approval' && <FaCheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />}
                                            {activity.type === 'user' && <FaUsers className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                                            {activity.type === 'removal' && <FaHotel className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{activity.action}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {activity.hotel || activity.user} • {activity.time}
                                            </p>
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

export default SuperAdminDashboard;
