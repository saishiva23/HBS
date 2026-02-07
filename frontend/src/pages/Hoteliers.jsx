import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaHotel,
  FaArrowRight,
  FaGlobe,
  FaChartLine,
  FaHeadset,
  FaShieldAlt,
  FaMoneyBillWave,
  FaStar,
  FaCheck,
  FaBuilding,
  FaUser,
  FaTimes,
  FaCheckCircle,
} from 'react-icons/fa';
import { ownerAPI, publicAPI } from '../services/completeAPI';

const Hoteliers = () => {
  const navigate = useNavigate();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Owner Details
    ownerName: '',
    ownerEmail: '',
    password: '',
    ownerPhone: '',
    ownerDob: '',
    ownerAddress: '',
    // Hotel Details
    hotelName: '',
    hotelType: 'Hotel',
    starRating: '3',
    totalRooms: '',
    // Location
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    // Amenities
    amenities: [],
  });

  const hotelTypes = ['Hotel', 'Resort', 'Boutique Hotel', 'Motel', 'Guest House', 'Villa', 'Apartment'];
  const amenitiesList = [
    'AC', 'Parking', 'WiFi', 'Gym', 'Restaurant'
  ];

  const benefits = [
    {
      icon: FaGlobe,
      title: 'Global Reach',
      description: 'Connect with millions of travelers worldwide and increase your visibility.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: FaChartLine,
      title: 'Powerful Analytics',
      description: 'Get insights into your performance with detailed reports and analytics.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: FaMoneyBillWave,
      title: 'Increase Revenue',
      description: 'Dynamic pricing tools help you maximize revenue and occupancy rates.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with guaranteed payouts.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: FaHeadset,
      title: '24/7 Support',
      description: 'Dedicated partner support team available round the clock.',
      color: 'from-red-500 to-rose-600',
    },
    {
      icon: FaStar,
      title: 'Premium Visibility',
      description: 'Featured listings and promotional opportunities to stand out.',
      color: 'from-yellow-500 to-amber-600',
    },
  ];



  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const hotelData = {
        name: formData.hotelName,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        description: `${formData.hotelType} with ${formData.totalRooms} rooms`,
        starRating: parseInt(formData.starRating),
        priceRange: `₹5,000 - ₹15,000`, // Default range
        amenities: [], // Empty for now, sending booleans
        wifi: formData.amenities.includes('WiFi'),
        parking: formData.amenities.includes('Parking'),
        gym: formData.amenities.includes('Gym'),
        ac: formData.amenities.includes('AC'),
        restaurant: formData.amenities.includes('Restaurant'),
        roomService: false, // Not in basic list
        images: [] // Empty for now
      };

      if (token) {
        // Logged in: Create hotel only
        await ownerAPI.createHotel(hotelData);
        toast.success('Hotel registered successfully! Your property is now active and ready for bookings.', {
          duration: 4000,
          position: 'top-right',
        });
        navigate('/owner/dashboard');
      } else {
        // Public: Create User + Hotel with Auto-Login
        const nameParts = formData.ownerName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Owner';

        const registrationData = {
          user: {
            firstName: firstName,
            lastName: lastName,
            email: formData.ownerEmail,
            password: formData.password,
            phone: formData.ownerPhone,
            dob: formData.ownerDob,
            address: formData.ownerAddress
          },
          hotel: hotelData
        };

        // Backend now returns AuthResp with JWT token
        const response = await publicAPI.registerHotelWithUser(registrationData);

        // Store authentication data
        if (response.jwt) {
          localStorage.setItem('token', response.jwt);
          localStorage.setItem('user', JSON.stringify({
            name: response.name,
            email: formData.ownerEmail,
            role: response.role
          }));
        }

        toast.success('Hotel registered successfully! You are now logged in. Your property is active and ready for bookings.', {
          duration: 4000,
          position: 'top-right',
        });
      }

      // Reset form
      setShowRegistrationForm(false);
      setRegistrationStep(1);
      setFormData({
        ownerName: '',
        ownerEmail: '',
        password: '',
        ownerPhone: '',
        ownerDob: '',
        ownerAddress: '',
        hotelName: '',
        hotelType: 'Hotel',
        starRating: '3',
        totalRooms: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        amenities: [],
      });

      // Navigate to dashboard at the very end
      navigate('/owner/dashboard');

    } catch (error) {
      console.error('Hotel registration error:', error);

      // Handle validation errors (object with field-specific errors)
      if (error && typeof error === 'object' && !error.message && !error.error) {
        // Display each validation error as a separate toast
        Object.entries(error).forEach(([field, message]) => {
          const fieldName = field.split('.').pop(); // Get last part (e.g., 'address' from 'user.address')
          toast.error(`${fieldName}: ${message}`, {
            duration: 5000,
            position: 'top-right',
          });
        });
      } else {
        // Handle general error messages
        let errorMessage = 'Failed to register hotel. Please try again.';

        if (error.message) {
          errorMessage = error.message;
        } else if (error.error) {
          errorMessage = error.error;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        toast.error(errorMessage, {
          duration: 4000,
          position: 'top-right',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-6">
              <FaHotel className="h-4 w-4" />
              Partner with HBS
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                List Your Property
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">With Us Today</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of hoteliers who trust us to grow their business.
              Get access to millions of travelers and powerful tools to manage your property.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-yellow-600 transform hover:scale-105 transition-all"
              >
                <FaBuilding className="h-5 w-5" />
                Register Your Hotel
                <FaArrowRight className="h-5 w-5" />
              </button>
              <a
                href="#benefits"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-md transition-all"
              >
                Learn More
              </a>
            </div>


          </div>
        </div>
      </div>

      {/* Already a Partner Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Already a Partner?
              </h2>
              <p className="text-yellow-100">
                Access your Owner Dashboard to manage your properties
              </p>
            </div>
            <Link
              to="/owner/dashboard"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-yellow-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <FaHotel className="h-5 w-5" />
              Owner Dashboard
              <FaArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Site Admin Section */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Site Administrator?
              </h2>
              <p className="text-purple-100">
                Access the Admin Panel to manage the entire platform
              </p>
            </div>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <FaShieldAlt className="h-5 w-5" />
              Admin Panel
              <FaArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Partner With Us?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We provide everything you need to succeed in the hospitality industry
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${benefit.color} mb-6`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Register Your Property', description: 'Fill out the registration form with your hotel details and amenities.' },
              { step: 2, title: 'Verification & Setup', description: 'Our team verifies your property and helps you set up your listing.' },
              { step: 3, title: 'Start Receiving Bookings', description: 'Your hotel goes live and you start receiving bookings from travelers.' },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold rounded-full mb-6 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setShowRegistrationForm(true)}
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-yellow-600 transform hover:scale-105 transition-all"
            >
              Get Started Now
              <FaArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold">Register Your Hotel</h2>
                <p className="text-blue-100 text-sm">Step {registrationStep} of 3</p>
              </div>
              <button
                onClick={() => setShowRegistrationForm(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pt-4">
              <div className="flex gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full transition-all ${step <= registrationStep
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Step 1: Owner Details */}
              {registrationStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FaUser className="text-blue-500" />
                    Owner/Manager Details
                  </h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.ownerEmail}
                        onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                      />
                    </div>
                    {!localStorage.getItem('token') && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Password *
                        </label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Create a password"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.ownerPhone}
                        onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                        placeholder="+1 555-0000"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        value={formData.ownerDob}
                        onChange={(e) => setFormData({ ...formData, ownerDob: e.target.value })}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Address *
                      </label>
                      <textarea
                        value={formData.ownerAddress}
                        onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })}
                        placeholder="Enter your full address (min. 10 characters)"
                        rows="3"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Hotel Details */}
              {registrationStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FaHotel className="text-blue-500" />
                    Hotel Details
                  </h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Hotel Name *
                      </label>
                      <input
                        type="text"
                        value={formData.hotelName}
                        onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                        placeholder="Enter hotel name"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Property Type
                        </label>
                        <select
                          value={formData.hotelType}
                          onChange={(e) => setFormData({ ...formData, hotelType: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                        >
                          {hotelTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Star Rating
                        </label>
                        <select
                          value={formData.starRating}
                          onChange={(e) => setFormData({ ...formData, starRating: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                        >
                          {[1, 2, 3, 4, 5].map(rating => (
                            <option key={rating} value={rating}>{rating} Star</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Total Rooms *
                      </label>
                      <input
                        type="number"
                        value={formData.totalRooms}
                        onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                        placeholder="Number of rooms"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Street address"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="City"
                        className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                      />
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="State"
                        className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="Country"
                        className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                      />
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="PIN/ZIP Code"
                        className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Amenities & Submit */}
              {registrationStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    Amenities & Features
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select the amenities your property offers
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenitiesList.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${formData.amenities.includes(amenity)
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                      >
                        {formData.amenities.includes(amenity) && <FaCheck className="inline mr-2 h-3 w-3" />}
                        {amenity}
                      </button>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mt-6">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Registration Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-600 dark:text-gray-400">Owner: {formData.ownerName || '-'}</p>
                      <p className="text-gray-600 dark:text-gray-400">Hotel: {formData.hotelName || '-'}</p>
                      <p className="text-gray-600 dark:text-gray-400">Type: {formData.hotelType}</p>
                      <p className="text-gray-600 dark:text-gray-400">Rooms: {formData.totalRooms || '-'}</p>
                      <p className="text-gray-600 dark:text-gray-400 col-span-2">Location: {formData.city}, {formData.country || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                {registrationStep > 1 && (
                  <button
                    onClick={() => setRegistrationStep(prev => prev - 1)}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
                  >
                    Previous
                  </button>
                )}
                {registrationStep < 3 ? (
                  <button
                    onClick={() => setRegistrationStep(prev => prev + 1)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 shadow-lg transition-all"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-yellow-600 shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaCheckCircle className="h-5 w-5" />
                    {loading ? 'Submitting...' : 'Submit Registration'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hoteliers;
