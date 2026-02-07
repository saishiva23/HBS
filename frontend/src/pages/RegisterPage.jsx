import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        dob: '',
        address: '',
        regAmount: 500
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for this field when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // First Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10,14}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10-14 digits';
        }

        // DOB validation
        if (!formData.dob) {
            newErrors.dob = 'Date of birth is required';
        } else {
            const dobDate = new Date(formData.dob);
            const today = new Date();
            if (dobDate > today) {
                newErrors.dob = 'Date of birth cannot be in the future';
            }
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        } else if (formData.address.length < 10) {
            newErrors.address = 'Address must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/users/signup', formData);
            console.log('Registration successful:', response.data);
            toast.success('Account created successfully!');
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error ||
                                'Registration failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        All fields are required
                    </p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                name="firstName"
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                                placeholder="First Name *"
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <input
                                name="lastName"
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                                placeholder="Last Name *"
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <input
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="Email address *"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <input
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                            placeholder="Password (min. 6 characters) *"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <input
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                            placeholder="Phone Number (10-14 digits) *"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date of Birth *
                        </label>
                        <input
                            name="dob"
                            type="date"
                            required
                            value={formData.dob}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                            className={`input-field ${errors.dob ? 'border-red-500' : ''}`}
                        />
                        {errors.dob && (
                            <p className="mt-1 text-xs text-red-500">{errors.dob}</p>
                        )}
                    </div>

                    <div>
                        <textarea
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                            placeholder="Full Address (min. 10 characters) *"
                        />
                        {errors.address && (
                            <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
