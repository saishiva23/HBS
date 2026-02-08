import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCredentials, setShowCredentials] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Minimum loading time for better UX (prevents flickering)
        const minLoadTime = new Promise(resolve => setTimeout(resolve, 800));

        try {
            const [result] = await Promise.all([
                login(email, password),
                minLoadTime
            ]);

            if (result.success) {
                const user = result.user;

                // Role-based redirect
                if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'hotel_admin' || user.role === 'ROLE_ADMIN') {
                    toast.success(`Welcome back, ${user.name}!`);
                    navigate('/admin/dashboard');
                } else if (user.role === 'owner' || user.role === 'ROLE_HOTEL_MANAGER') {
                    toast.success(`Welcome back, ${user.name}!`);
                    navigate('/owner/dashboard');
                } else {
                    toast.success(`Welcome back, ${user.name}!`);
                    navigate('/');
                }
            } else {
                toast.error(result.error || 'Login failed');
                setPassword(''); // Clear password on error
            }
        } catch {
            toast.error('An unexpected error occurred');
            setPassword('');
        } finally {
            setLoading(false);
        }
    };

    const fillTestCredentials = (type) => {
        if (type === 'user') {
            setEmail('user@stays.in');
            setPassword('password123');
        } else if (type === 'admin') {
            setEmail('admin@stays.in');
            setPassword('admin123');
        } else if (type === 'owner') {
            setEmail('owner@stays.in');
            setPassword('owner123');
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Access your bookings, favorites, and more
                    </p>
                </div>

                {/* Test Credentials Helper */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Test Credentials</span>
                        <button
                            type="button"
                            onClick={() => setShowCredentials(!showCredentials)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm underline transition-colors"
                        >
                            {showCredentials ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    {showCredentials && (
                        <div className="space-y-3 mt-3">
                            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-100 dark:border-gray-700 transition-colors">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Regular User</p>
                                    <p className="text-sm font-mono text-gray-700 dark:text-gray-200">user@stays.in / password123</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fillTestCredentials('user')}
                                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Use
                                </button>
                            </div>
                            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-100 dark:border-gray-700 transition-colors">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Admin User</p>
                                    <p className="text-sm font-mono text-gray-700 dark:text-gray-200">admin@stays.in / admin123</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fillTestCredentials('admin')}
                                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Use
                                </button>
                            </div>
                            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-100 dark:border-gray-700 transition-colors">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Hotel Owner</p>
                                    <p className="text-sm font-mono text-gray-700 dark:text-gray-200">owner@stays.in / owner123</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fillTestCredentials('owner')}
                                    className="text-xs bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors"
                                >
                                    Use
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Login Form */}
                <form className="mt-8 space-y-6 text-left" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all shadow-sm"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all shadow-sm"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-yellow-600 dark:text-yellow-500 focus:ring-yellow-500 border-gray-300 dark:border-gray-600 rounded transition-colors"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-400 transition-colors">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-yellow-600 dark:text-yellow-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-yellow-600 dark:text-yellow-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
