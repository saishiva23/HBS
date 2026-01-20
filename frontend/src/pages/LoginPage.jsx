import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Mock API and Auth (Temporary fix)
const authAPI = {
  login: async (credentials) => {
    console.log("Login with:", credentials);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: {
                    data: {
                        user: { role: 'user', name: 'Test User' },
                        token: 'fake-token-123'
                    }
                }
            });
        }, 1000);
    });
  }
};

const setAuth = (user, token) => {
    console.log("Auth Set:", user, token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await authAPI.login({ email, password });
            const user = data.data.user;
            const token = data.data.token;

            setAuth(user, token);

            // Role-based redirect
            if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'hotel_admin') {
                toast.success('Welcome back, Admin!');
                navigate('/admin');
            } else {
                toast.success('Welcome back!');
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" h-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field rounded-t-md rounded-b-none"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field rounded-b-md rounded-t-none"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
