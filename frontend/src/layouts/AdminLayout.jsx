import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLock, FaShieldAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import {
    FaChartBar,
    FaHotel,
    FaUsers,
    FaMapMarkerAlt,
    FaChartPie,
    FaCheckCircle,
    FaCog,
    FaArrowLeft,
    FaBars,
    FaTimes,
} from 'react-icons/fa';
import { useState } from 'react';

const AdminLayout = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check if user is authenticated and has admin role (Site Admin only)
    const isAuthorized = isAuthenticated && user?.role === 'admin';

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated but not an Admin, show access denied
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center p-4 pt-24">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <FaLock className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Access Denied
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        You need to be logged in as an <strong>Admin</strong> to access this panel.
                    </p>
                    <div className="space-y-3">
                        <a
                            href="/"
                            className="block w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Go to Home
                        </a>
                        <a
                            href="/login"
                            className="block w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            Sign in as Admin
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: FaChartBar },
        { path: '/admin/approvals', label: 'Hotel Approvals', icon: FaCheckCircle },
        { path: '/admin/hotels', label: 'All Hotels', icon: FaHotel },
        { path: '/admin/locations', label: 'Locations', icon: FaMapMarkerAlt },
        { path: '/admin/customers', label: 'Customers', icon: FaUsers },
        { path: '/admin/analytics', label: 'Analytics', icon: FaChartPie },
    ];

    const isActive = (path) => location.pathname === path;

    // Authorized - render the admin panel
    return (
        <div className="flex pt-20">
            {/* Mobile Menu Toggle */}
            <div className="md:hidden fixed top-24 right-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                    {isMobileMenuOpen ? (
                        <FaTimes className="h-6 w-6" />
                    ) : (
                        <FaBars className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-20 h-[calc(100vh-80px)] bg-white dark:bg-gray-800 shadow-xl z-[60] transition-transform duration-300 border-r border-gray-100 dark:border-gray-700 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 w-64`}
            >
                <div className="p-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    {/* Logo/Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl">
                                <FaShieldAlt className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    Admin Panel
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">System Management</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${active
                                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 border border-transparent hover:border-purple-400'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Divider */}
                    <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

                    {/* Back to Main Site */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-500 transition-all"
                    >
                        <FaArrowLeft className="h-4 w-4" />
                        Back to Main Site
                    </Link>
                </div>

                {/* User Info at Bottom */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
