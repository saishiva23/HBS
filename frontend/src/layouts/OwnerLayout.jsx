import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHotel } from '../context/HotelContext';
import OwnerNavigation from '../components/OwnerNavigation';
import { FaLock } from 'react-icons/fa';

const OwnerLayout = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const { hotels, loading } = useHotel();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    // Check if user is authenticated and has owner role (Hotel Owner only)
    const isAuthorized = isAuthenticated && (user?.role === 'owner' || user?.role === 'ROLE_HOTEL_MANAGER');

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated but not authorized (not owner), show access denied
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <FaLock className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Access Denied
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        You are logged in as <strong>{user?.name}</strong> ({user?.role}), but you need to be a <strong>Hotel Owner</strong> to access this panel.
                    </p>
                    <div className="space-y-3">
                        <a
                            href="/"
                            className="block w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Go to Home
                        </a>
                        <a
                            href="/login"
                            className="block w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            Sign in as Owner
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Show loading while fetching hotels
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Check if owner has no hotels at all (deleted or never created)
    // This check must come BEFORE the pending check
    if (hotels.length === 0 && location.pathname !== '/owner/no-hotels') {
        return <Navigate to="/owner/no-hotels" replace />;
    }

    // Check if all hotels are pending (only redirect from non-special pages)
    if (hotels.length > 0) {
        const allPending = hotels.every(h => h.status === 'PENDING');
        const hasApproved = hotels.some(h => h.status === 'APPROVED');

        // If ALL hotels are pending AND not already on pending page, redirect
        if (allPending && location.pathname !== '/owner/pending-approval') {
            return <Navigate to="/owner/pending-approval" replace />;
        }

        // If on no-hotels page but have hotels now, redirect appropriately
        if (location.pathname === '/owner/no-hotels') {
            if (allPending) {
                return <Navigate to="/owner/pending-approval" replace />;
            } else if (hasApproved) {
                return <Navigate to="/owner/hotel-profile" replace />;
            }
        }
    }

    // Authorized - render the owner panel
    return (
        <div className="flex pt-20">
            <OwnerNavigation isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {children}
            </div>
        </div>
    );
};

export default OwnerLayout;
