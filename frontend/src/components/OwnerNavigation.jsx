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
    FaExclamationCircle,
} from 'react-icons/fa';
import { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';

const OwnerNavigation = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showHotelSelector, setShowHotelSelector] = useState(false);
    const { hotels, selectedHotel, selectHotel } = useHotel();
    const { user } = useAuth();

    const navItems = [
        { path: '/owner/hotel-profile', label: 'Hotel Profile', icon: FaHotel },
        { path: '/owner/rooms', label: 'Rooms', icon: FaBed },
        { path: '/owner/room-types', label: 'Room Types', icon: FaBed },
        { path: '/owner/bookings', label: 'Bookings', icon: FaCalendarAlt },
        { path: '/owner/experience', label: 'Customer Experience', icon: FaStar },
        { path: '/owner/payments', label: 'Payments', icon: FaMoneyBillWave },
    ];

    const isActive = (path) => location.pathname === path;

    const handleHotelSelect = (hotelId) => {
        selectHotel(hotelId);
        setShowHotelSelector(false);
    };

    return (
        <>
            {/* Mobile Menu Toggle */}
            <div className="md:hidden fixed top-20 right-4 z-50">
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
                className={`fixed left-0 top-20 h-[calc(100vh-80px)] bg-white dark:bg-gray-800 shadow-xl z-[60] transition-all duration-300 border-r border-gray-100 dark:border-gray-700 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 ${isCollapsed ? 'w-20' : 'w-64'}`}
            >
                {/* Collapse Toggle Button (Desktop Only) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3 top-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 text-gray-500 hover:text-yellow-600 shadow-md z-50 transition-all"
                >
                    <FaChevronDown className={`h-3 w-3 transition-transform ${isCollapsed ? '-rotate-90' : 'rotate-90'}`} />
                </button>

                {/* Scrollable Navigation Area */}
                <div className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-6'}`}>
                    {/* Logo/Header */}
                    <div className={`${isCollapsed ? 'mb-8' : 'mb-6'}`}>
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-2`}>
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex-shrink-0">
                                <FaHotel className="h-8 w-8 text-white" />
                            </div>
                            {!isCollapsed && (
                                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate whitespace-nowrap">
                                    Owner Panel
                                </h2>
                            )}
                        </div>
                    </div>

                    {/* Hotel Selector */}
                    <div className={`${isCollapsed ? 'mb-8' : 'mb-6'} relative`}>
                        <button
                            onClick={() => setShowHotelSelector(!showHotelSelector)}
                            title={isCollapsed ? selectedHotel?.name : ''}
                            className={`w-full flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 transition-all ${isCollapsed ? 'p-2 justify-center' : 'p-3 gap-3'}`}
                        >
                            <img
                                src={selectedHotel?.image}
                                alt={selectedHotel?.name}
                                className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                            />
                            {!isCollapsed && (
                                <>
                                    <div className="flex-1 text-left truncate">
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                            {selectedHotel?.name}
                                        </p>
                                        {(user?.role !== 'Hotel Owner' && user?.role !== 'ROLE_HOTEL_MANAGER') ? (
                                            <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                                                You are logged in as <strong>{user?.name}</strong>, but need owner access.
                                            </p>
                                        ) : (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {selectedHotel?.location}
                                            </p>
                                        )}
                                    </div>
                                    <FaChevronDown className={`h-4 w-4 flex-shrink-0 text-gray-500 transition-transform ${showHotelSelector ? 'rotate-180' : ''}`} />
                                </>
                            )}
                        </button>

                        {/* Hotel Dropdown */}
                        {showHotelSelector && (
                            <div className={`absolute top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden ${isCollapsed ? 'left-0 w-64' : 'left-0 right-0'}`}>
                                <div className="p-2">
                                    <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <FaExchangeAlt className="h-3 w-3" />
                                        Switch Hotel
                                    </p>
                                    {hotels
                                        .filter(hotel => hotel.id !== selectedHotel?.id)
                                        .map((hotel) => (
                                            <button
                                                key={hotel.id}
                                                onClick={() => handleHotelSelect(hotel.id)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700`}
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
                                            </button>
                                        ))}
                                    {hotels.length <= 1 && (
                                        <p className="px-3 py-2 text-xs text-gray-400 italic">No other hotels available.</p>
                                    )}
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
                                    title={isCollapsed ? item.label : ''}
                                    className={`flex items-center rounded-xl font-semibold transition-all ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'} ${active
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-700 border border-transparent hover:border-yellow-400'
                                        }`}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0" />
                                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Divider */}
                    <div className={`border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCollapsed ? 'my-4' : 'my-6'}`}></div>

                    {/* Back to Main Site */}
                    <Link
                        to="/"
                        title={isCollapsed ? 'Back to Main Site' : ''}
                        className={`flex items-center rounded-xl font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-500 transition-all ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'}`}
                    >
                        <FaArrowLeft className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && <span className="truncate">Back to Main Site</span>}
                    </Link>
                </div>

                {/* User Info at Bottom */}
                <div className={`border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-6'}`}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold shadow-md">
                            {(() => {
                                const userData = localStorage.getItem('user');
                                if (userData) {
                                    try {
                                        const parsedUser = JSON.parse(userData);
                                        const nameParts = parsedUser.name?.split(' ') || ['U'];
                                        return nameParts.map(part => part[0]?.toUpperCase() || '').join('').slice(0, 2);
                                    } catch {
                                        return 'U';
                                    }
                                }
                                return 'U';
                            })()}
                        </div>
                        {!isCollapsed && (
                            <div className="truncate">
                                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                    {(() => {
                                        const userData = localStorage.getItem('user');
                                        if (userData) {
                                            try {
                                                const parsedUser = JSON.parse(userData);
                                                return parsedUser.name || 'Hotel Owner';
                                            } catch {
                                                return 'Hotel Owner';
                                            }
                                        }
                                        return 'Hotel Owner';
                                    })()}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {(() => {
                                        const userData = localStorage.getItem('user');
                                        if (userData) {
                                            try {
                                                const parsedUser = JSON.parse(userData);
                                                return parsedUser.role?.replace('ROLE_', '').replace('_', ' ') || 'Hotel Manager';
                                            } catch {
                                                return 'Hotel Manager';
                                            }
                                        }
                                        return 'Hotel Manager';
                                    })()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div >

            {/* Overlay for mobile */}
            {
                isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                )
            }
        </>
    );
};

export default OwnerNavigation;
