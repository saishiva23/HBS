import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
    FaBuilding,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaGlobe,
    FaImage,
    FaStar,
    FaWifi,
    FaTv,
    FaFire,
    FaBolt,
    FaCheckCircle,
} from 'react-icons/fa';

const HotelProfileManagement = () => {
    const [hotelData, setHotelData] = useState({
        name: 'Grand Luxury Hotel & Spa',
        category: 'Luxury',
        rating: 5,
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567',
        email: 'info@grandluxury.com',
        website: 'www.grandluxury.com',
        description: 'Experience unparalleled luxury in the heart of Manhattan...',
        checkInTime: '3:00 PM',
        checkOutTime: '11:00 AM',
    });

    const [amenities, setAmenities] = useState([
        { id: 1, name: 'Free WiFi', icon: FaWifi, selected: true },
        { id: 2, name: 'Swimming Pool', icon: FaFire, selected: true },
        { id: 3, name: 'Fitness Center', icon: FaBolt, selected: true },
        { id: 4, name: 'Spa & Wellness', icon: FaStar, selected: true },
        { id: 5, name: 'Restaurant', icon: FaFire, selected: true },
        { id: 6, name: 'Room Service', icon: FaTv, selected: true },
        { id: 7, name: 'Bar/Lounge', icon: FaFire, selected: false },
        { id: 8, name: 'Conference Rooms', icon: FaBuilding, selected: true },
    ]);

    const [images, setImages] = useState([
        { id: 1, url: '/hotel-main.jpg', type: 'main' },
        { id: 2, url: '/hotel-lobby.jpg', type: 'gallery' },
        { id: 3, url: '/hotel-pool.jpg', type: 'gallery' },
        { id: 4, url: '/hotel-room.jpg', type: 'gallery' },
    ]);

    const [activeTab, setActiveTab] = useState('basic');

    const handleInputChange = (e) => {
        setHotelData({ ...hotelData, [e.target.name]: e.target.value });
    };

    const toggleAmenity = (id) => {
        setAmenities(amenities.map(amenity =>
            amenity.id === id ? { ...amenity, selected: !amenity.selected } : amenity
        ));
    };

    const handleSave = () => {
        console.log('Saving hotel profile:', hotelData);
        // API call here
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Hotel Profile Management 🏨
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your property information and settings
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {[
                            { id: 'basic', label: 'Basic Info', icon: FaBuilding },
                            { id: 'contact', label: 'Contact', icon: FaPhone },
                            { id: 'amenities', label: 'Amenities', icon: FaStar },
                            { id: 'images', label: 'Images', icon: FaImage },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-yellow-400'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                        {/* Basic Info Tab */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Basic Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Hotel Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={hotelData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={hotelData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        >
                                            <option>Budget</option>
                                            <option>Standard</option>
                                            <option>Premium</option>
                                            <option>Luxury</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Star Rating *
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setHotelData({ ...hotelData, rating: star })}
                                                    className={`p-3 rounded-xl transition-all ${star <= hotelData.rating
                                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-400'
                                                        }`}
                                                >
                                                    <FaStar className="h-6 w-6" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={hotelData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={hotelData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            State/Province *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={hotelData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Check-in Time *
                                        </label>
                                        <input
                                            type="time"
                                            name="checkInTime"
                                            value={hotelData.checkInTime}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Check-out Time *
                                        </label>
                                        <input
                                            type="time"
                                            name="checkOutTime"
                                            value={hotelData.checkOutTime}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={hotelData.description}
                                        onChange={handleInputChange}
                                        rows="6"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        placeholder="Tell guests about your property..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Contact Tab */}
                        {activeTab === 'contact' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <FaPhone className="h-5 w-5 inline mr-2" />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={hotelData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <FaEnvelope className="h-5 w-5 inline mr-2" />
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={hotelData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <FaGlobe className="h-5 w-5 inline mr-2" />
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={hotelData.website}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Amenities Tab */}
                        {activeTab === 'amenities' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Hotel Amenities</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {amenities.map((amenity) => {
                                        const Icon = amenity.icon;
                                        return (
                                            <button
                                                key={amenity.id}
                                                onClick={() => toggleAmenity(amenity.id)}
                                                className={`relative p-4 rounded-xl border-2 transition-all ${amenity.selected
                                                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20'
                                                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {amenity.selected && (
                                                    <FaCheckCircle className="absolute top-2 right-2 h-6 w-6 text-indigo-600" />
                                                )}
                                                <Icon className={`h-8 w-8 mb-2 ${amenity.selected ? 'text-indigo-600' : 'text-gray-400'}`} />
                                                <p className={`font-semibold ${amenity.selected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                    {amenity.name}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Images Tab */}
                        {activeTab === 'images' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Hotel Images</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {images.map((image) => (
                                        <div key={image.id} className="relative group">
                                            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center overflow-hidden">
                                                <FaImage className="h-16 w-16 text-gray-400" />
                                            </div>
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <button className="px-4 py-2 bg-white rounded-lg font-semibold mr-2">Edit</button>
                                                <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold">Delete</button>
                                            </div>
                                            {image.type === 'main' && (
                                                <span className="absolute top-2 left-2 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                                                    Main Photo
                                                </span>
                                            )}
                                        </div>
                                    ))}

                                    <button className="aspect-video border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                                        <FaImage className="h-12 w-12 text-gray-400 mb-2" />
                                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Add Image</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={handleSave}
                                className="flex-1 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-500/30 transition-all"
                            >
                                Save Changes
                            </button>
                            <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout >
    );
};

export default HotelProfileManagement;
