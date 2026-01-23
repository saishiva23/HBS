import { Link, useLocation } from 'react-router-dom';
import {
    FaChartBar,
    FaHotel,
    FaBed,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaStar,
    FaChartPie,
    FaCog,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaArrowLeft,
    FaChevronDown,
    FaExchangeAlt,
} from 'react-icons/fa';
import { useState } from 'react';
import { useHotel } from '../context/HotelContext';

const AdminNavigation = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showHotelSelector, setShowHotelSelector] = useState(false);
    const { hotels, selectedHotel, selectHotel } = useHotel();

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: FaChartBar },
        { path: '/admin/hotel-profile', label: 'Hotel Profile', icon: FaHotel },
        { path: '/admin/rooms', label: 'Rooms', icon: FaBed },
        { path: '/admin/bookings', label: 'Bookings', icon: FaCalendarAlt },
        { path: '/admin/pricing', label: 'Pricing', icon: FaMoneyBillWave },
        { path: '/admin/reviews', label: 'Reviews', icon: FaStar },
        { path: '/admin/revenue', label: 'Revenue', icon: FaChartPie },
        { path: '/admin/settings', label: 'Settings', icon: FaCog },
    ];

    const isActive = (path) => location.pathname === path;

    const handleHotelSelect = (hotelId) => {
        selectHotel(hotelId);
        setShowHotelSelector(false);
    };

    return (
        <>
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden fixed top-20 right-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
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
                className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-xl z-40 transition-transform duration-300 border-r border-gray-100 dark:border-gray-700 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 w-64`}
            >
                <div className="p-6">
                    {/* Logo/Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
                                <FaHotel className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Admin Panel
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Hotel Selector */}
                    <div className="mb-6 relative">
                        <button
                            onClick={() => setShowHotelSelector(!showHotelSelector)}
                            className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 transition-all"
                        >
                            <img
                                src={selectedHotel?.image}
                                alt={selectedHotel?.name}
                                className="h-10 w-10 rounded-lg object-cover"
                            />
                            <div className="flex-1 text-left">
                                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                    {selectedHotel?.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {selectedHotel?.location}
                                </p>
                            </div>
                            <FaChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showHotelSelector ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Hotel Dropdown */}
                        {showHotelSelector && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                                <div className="p-2">
                                    <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <FaExchangeAlt className="h-3 w-3" />
                                        Switch Hotel
                                    </p>
                                    {hotels.map((hotel) => (
                                        <button
                                            key={hotel.id}
                                            onClick={() => handleHotelSelect(hotel.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${selectedHotel?.id === hotel.id
                                                    ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-300 dark:border-yellow-700'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <img
                                                src={hotel.image}
                                                alt={hotel.name}
                                                className="h-10 w-10 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 text-left">
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    {hotel.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {hotel.location} • {hotel.totalRooms} rooms
                                                </p>
                                            </div>
                                            {selectedHotel?.id === hotel.id && (
                                                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
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
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-700 border border-transparent hover:border-yellow-400'
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
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-500 transition-all"
                    >
                        <FaArrowLeft className="h-4 w-4" />
                        Back to Main Site
                    </Link>
                </div>

                {/* User Info at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                            JD
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">John Doe</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Hotel Manager</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
        </>
    );
};

export default AdminNavigation;
