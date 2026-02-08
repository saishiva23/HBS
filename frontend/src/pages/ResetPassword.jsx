import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            toast.error('Invalid reset link');
            navigate('/login');
            return;
        }

        setToken(tokenParam);
        validateToken(tokenParam);
    }, [searchParams, navigate]);

    const validateToken = async (tokenToValidate) => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/users/validate-reset-token',
                { params: { token: tokenToValidate } }
            );

            if (response.status === 200) {
                setTokenValid(true);
            } else {
                setTokenValid(false);
                toast.error('This reset link is invalid or has expired');
            }
        } catch (error) {
            console.error('Token validation error:', error);
            setTokenValid(false);
            toast.error('This reset link is invalid or has expired');
        } finally {
            setValidating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (newPassword.length < 4) {
            toast.error('Password must be at least 4 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:8080/api/users/reset-password-with-token',
                null,
                {
                    params: {
                        token,
                        newPassword
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Password reset successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            console.error('Password reset error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to reset password';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (password.length === 0) return { strength: '', color: '' };
        if (password.length < 4) return { strength: 'Too short', color: 'text-red-500' };
        if (password.length < 8) return { strength: 'Weak', color: 'text-orange-500' };
        if (password.length < 12) return { strength: 'Good', color: 'text-yellow-500' };
        return { strength: 'Strong', color: 'text-green-500' };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    // Loading state while validating token
    if (validating) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 mx-auto text-yellow-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Validating reset link...</p>
                </div>
            </div>
        );
    }

    // Invalid token state
    if (!tokenValid) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                        <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                            Invalid or Expired Link
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                            This password reset link is invalid or has expired. Reset links are only valid for 15 minutes.
                        </p>
                        <Link
                            to="/forgot-password"
                            className="inline-block bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                        >
                            Request New Link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Reset password form
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Reset Your Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Enter your new password below
                    </p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* New Password */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all shadow-sm pr-10"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {newPassword && (
                                <p className={`text-xs mt-1 ${passwordStrength.color}`}>
                                    Password strength: {passwordStrength.strength}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all shadow-sm"
                                placeholder="Confirm new password"
                            />
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">
                                    Passwords do not match
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || newPassword !== confirmPassword || newPassword.length < 4}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Resetting Password...
                                </span>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                            ← Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
