import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:8080/api/users/forgot-password',
                null,
                { params: { email } }
            );

            if (response.status === 200) {
                setEmailSent(true);
                toast.success('Password reset link sent! Check your email.');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            // Show success message even on error (security best practice)
            setEmailSent(true);
            toast.success('If an account exists, a reset link has been sent');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Forgot Password?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {emailSent
                            ? "Check your email for reset instructions"
                            : "Enter your email to receive password reset instructions"}
                    </p>
                </div>

                {!emailSent ? (
                    /* Email Input Form */
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                                        Sending...
                                    </span>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                Remember your password?{' '}
                                <Link to="/login" className="font-medium text-yellow-600 dark:text-yellow-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                ) : (
                    /* Success Message */
                    <div className="mt-8 space-y-6">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 transition-colors">
                            <div className="flex items-center justify-center mb-4">
                                <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-center text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                                Email Sent!
                            </h3>
                            <p className="text-center text-sm text-green-700 dark:text-green-400">
                                If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
                            </p>
                            <p className="text-center text-xs text-green-600 dark:text-green-500 mt-3">
                                The link will expire in 15 minutes.
                            </p>
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Didn't receive the email?
                            </p>
                            <button
                                onClick={() => {
                                    setEmailSent(false);
                                    setEmail('');
                                }}
                                className="text-sm font-medium text-yellow-600 dark:text-yellow-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                            >
                                Try again
                            </button>
                        </div>

                        <div className="text-center">
                            <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                                ← Back to login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
