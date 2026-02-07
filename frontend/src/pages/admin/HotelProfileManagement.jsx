import { useState, useEffect } from 'react';
import OwnerLayout from '../../layouts/OwnerLayout';
import { useHotel } from '../../context/HotelContext';
import { ownerHotelManagement } from '../../services/completeAPI';
import { normalizeImageUrl, getUrlTypeMessage } from '../../utils/imageUtils';
import { useToast } from '../../contexts/ToastContext';
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
    FaTrash,
} from 'react-icons/fa';

const HotelProfileManagement = () => {
    const { selectedHotel } = useHotel();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [hotelData, setHotelData] = useState({
        name: '',
        category: 'Standard',
        rating: 3,
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: '',
        email: '',
        website: '',
        description: '',
        checkInTime: '12:00',
        checkOutTime: '11:00',
    });

    const [amenities, setAmenities] = useState([]);
    const [images, setImages] = useState([]); // Array of strings (URLs)

    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        if (selectedHotel) {
            fetchHotelDetails();
        }
    }, [selectedHotel]);

    const fetchHotelDetails = async () => {
        setIsLoading(true);
        try {
            // Use ownerHotelManagement.getHotel or use selectedHotel data if redundant?
            // selectedHotel from context might be stale or partial. Better to fetch fresh.
            const data = await ownerHotelManagement.getHotel(selectedHotel.id);
            setHotelData({
                name: data.name || '',
                category: 'Standard', // Backend might not have category enum mapped? HotelDTO has? Check.
                // HotelDTO has: name, city, state, country, zipCode, address, description, active (boolean)
                // It lacks: phone, email, website, checkIn/Out, rating (it has starRating?)
                // Let's rely on what's available.
                city: data.city || '',
                state: data.state || '',
                zipCode: data.zipCode || '',
                country: data.country || '',
                address: data.address || '',
                description: data.description || '',
                rating: data.starRating || 3,
                // Missing fields in backend will remain blank or default
                phone: data.phone || '',
                email: data.email || '',
                website: data.website || '',
                checkInTime: data.checkInTime || '12:00',
                checkOutTime: data.checkOutTime || '11:00',
            });

            // Parse amenities/images if needed, or if API returns list for DTO
            // ownerHotelManagement.getHotel returns HotelDTO which has List<String> images/amenities.
            // Parse amenities booleans to list
            const currentAmenities = [];
            if (data.wifi) currentAmenities.push('WiFi');
            if (data.parking) currentAmenities.push('Parking');
            if (data.gym) currentAmenities.push('Gym');
            if (data.ac) currentAmenities.push('AC');
            if (data.restaurant) currentAmenities.push('Restaurant');
            setAmenities(currentAmenities);

            setImages(Array.isArray(data.images) ? data.images : []);

        } catch (error) {
            console.error("Failed to fetch hotel details", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setHotelData({ ...hotelData, [e.target.name]: e.target.value });
    };

    const amenitiesList = [
        'AC', 'Parking', 'WiFi', 'Gym', 'Restaurant'
    ];

    const handleAmenityToggle = (amenity) => {
        setAmenities(prev => 
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    // Image upload handler (Mock - just adds base64 or placeholder)
    const handleImageUpload = (files) => {
        if (!files || files.length === 0) return;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                // In real app, upload to server and get URL. Here we define logic.
                // For now, assume backend accepts Base64 or we just use it for display
                // Note: Sending large Base64 strings to backend JSON column is bad practice but fits current "MVP".
                setImages(prev => [...prev, e.target.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDeleteImage = (index) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            setImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Set main image (move to index 0)
    const handleSetMainImage = (index) => {
        const newImages = [...images];
        const [moved] = newImages.splice(index, 1);
        newImages.unshift(moved);
        setImages(newImages);
    };

    const handleSave = async () => {
        if (!selectedHotel) return;
        try {
            const payload = {
                ...hotelData,
                starRating: hotelData.rating,
                amenities: [],
                wifi: amenities.includes('WiFi'),
                parking: amenities.includes('Parking'),
                gym: amenities.includes('Gym'),
                ac: amenities.includes('AC'),
                restaurant: amenities.includes('Restaurant'),
                roomService: false,
                images: images,
            };
            await ownerHotelManagement.updateHotel(selectedHotel.id, payload);
            showToast('Hotel profile updated successfully!', 'success');
            fetchHotelDetails();
        } catch (error) {
            console.error("Failed to update profile", error);
            showToast("Failed to update: " + error.message, 'error');
        }
    };

    return (
        <OwnerLayout>
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

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                        Select available amenities
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {amenitiesList.map((amenity) => (
                                            <button
                                                key={amenity}
                                                type="button"
                                                onClick={() => handleAmenityToggle(amenity)}
                                                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${amenities.includes(amenity)
                                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                {amenities.includes(amenity) && <FaCheckCircle className="h-4 w-4" />}
                                                {amenity}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
                                        * Selected amenities will be highlighted and displayed to guests.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Images Tab */}
                        {activeTab === 'images' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hotel Images</h2>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {images.length} image{images.length !== 1 ? 's' : ''} uploaded
                                    </span>
                                </div>

                                {/* Image Link Input */}
                                <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Image Link</h3>
                                    <div className="flex gap-4">
                                        <input
                                            type="url"
                                            placeholder="Paste any image URL (Google Drive share links auto-convert!)"
                                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const val = e.target.value;
                                                    if (val) {
                                                        const normalizedUrl = normalizeImageUrl(val);
                                                        if (normalizedUrl) {
                                                            setImages(prev => [...prev, normalizedUrl]);
                                                            showToast(getUrlTypeMessage(val), 'success');
                                                            e.target.value = '';
                                                        } else {
                                                            showToast('Invalid image URL. Please try again.', 'error');
                                                        }
                                                    }
                                                }
                                            }}
                                            id="imageUrlInput"
                                        />
                                        <button
                                            onClick={() => {
                                                const input = document.getElementById('imageUrlInput');
                                                const val = input.value;
                                                if (val) {
                                                    const normalizedUrl = normalizeImageUrl(val);
                                                    if (normalizedUrl) {
                                                        setImages(prev => [...prev, normalizedUrl]);
                                                        showToast(getUrlTypeMessage(val), 'success');
                                                        input.value = '';
                                                    } else {
                                                        showToast('Invalid image URL. Please check the format.', 'error');
                                                    }
                                                }
                                            }}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
                                        >
                                            <FaImage />
                                            Add Link
                                        </button>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        💡 Google Drive share links are automatically converted to direct URLs!
                                    </p>
                                </div>

                                {/* Images Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {images.map((imgUrl, index) => (
                                        <div key={index} className="relative aspect-video rounded-xl overflow-hidden group border border-gray-200 dark:border-gray-700">
                                            <img src={imgUrl} alt={`Hotel ${index + 1}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                {index !== 0 && (
                                                    <button
                                                        onClick={() => handleSetMainImage(index)}
                                                        className="p-2 bg-yellow-500 text-white rounded-lg text-xs font-bold"
                                                        title="Set as Main"
                                                    >
                                                        Main
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteImage(index)}
                                                    className="p-2 bg-red-600 text-white rounded-lg"
                                                >
                                                    <FaEnvelope className="h-4 w-4" /> {/* Reuse icon or trash */}
                                                </button>
                                            </div>
                                            {index === 0 && (
                                                <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">
                                                    Main
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Tips */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📸 Photo Tips</h4>
                                    <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                                        <li>• Upload high-quality images (recommended: 1920x1080 or higher)</li>
                                        <li>• Include photos of rooms, lobby, amenities, and exterior</li>
                                        <li>• Set an attractive main photo - it appears in search results</li>
                                        <li>• Hotels with 10+ photos get 2x more bookings!</li>
                                    </ul>
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
        </OwnerLayout>
    );
};

export default HotelProfileManagement;
