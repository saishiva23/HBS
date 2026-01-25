import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OwnerNavigation from '../components/OwnerNavigation';
import { FaLock } from 'react-icons/fa';

const OwnerLayout = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Check if user is authenticated and has owner role (Hotel Owner only)
    const isAuthorized = isAuthenticated && user?.role === 'owner';

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
                        You need to be logged in as a <strong>Hotel Owner</strong> to access this panel.
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

    // Authorized - render the owner panel
    return (
        <div className="flex pt-20">
            <OwnerNavigation isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                {children}
            </div>
        </div>
    );
};

export default OwnerLayout;
