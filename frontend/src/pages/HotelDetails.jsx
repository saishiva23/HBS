import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaStar, FaWifi, FaParking, FaDumbbell, FaUtensils, FaSwimmingPool, FaArrowLeft } from 'react-icons/fa';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import customerAPI from '../services/customerAPI';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchHotelDetails();
        checkIfFavorite();
    }, [id]);

    const fetchHotelDetails = async () => {
        try {
            const data = await customerAPI.hotels.getById(id);

            // Parse images
            let images = [];
            try {
                images = typeof data.images === 'string' ? JSON.parse(data.images) : data.images || [];
            } catch {
                images = [data.images || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60'];
            }

            // Parse amenities
            const amenities = [];
            if (data.wifi) amenities.push({ icon: FaWifi, name: 'Free WiFi' });
            if (data.parking) amenities.push({ icon: FaParking, name: 'Parking' });
            if (data.gym) amenities.push({ icon: FaDumbbell, name: 'Gym' });
            if (data.restaurant) amenities.push({ icon: FaUtensils, name: 'Restaurant' });
            if (data.pool) amenities.push({ icon: FaSwimmingPool, name: 'Pool' });

            setHotel({ ...data, images, amenities });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching hotel:', error);
            toast.error('Failed to load hotel details');
            setLoading(false);
        }
    };

    const checkIfFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.some(f => f.id === parseInt(id)));
    };

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const hotelData = {
            id: hotel.id,
            name: hotel.name,
            city: hotel.city,
            state: hotel.state,
            image: hotel.images[0],
            price: parseInt(hotel.priceRange?.match(/(\d+)/)?.[0] || 5000),
            ratingScore: hotel.rating
        };

        let updated;
        if (isFavorite) {
            updated = favorites.filter(f => f.id !== hotel.id);
            toast.success('Removed from favorites');
        } else {
            updated = [...favorites, hotelData];
            toast.success('Added to favorites');
        }

        localStorage.setItem('favorites', JSON.stringify(updated));
        setIsFavorite(!isFavorite);
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
            toast.error('Please login to book');
            navigate('/login');
            return;
        }
        navigate(`/search?destination=${hotel.city}&hotelId=${hotel.id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold dark:text-white mb-4">Hotel not found</h2>
                <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
                >
                    <FaArrowLeft /> Back to Search
                </button>

                {/* Image Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="relative h-96 rounded-xl overflow-hidden">
                        <img
                            src={hotel.images[selectedImage] || hotel.images[0]}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {hotel.images.slice(0, 4).map((img, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`h-44 rounded-xl overflow-hidden cursor-pointer transition-all ${selectedImage === idx ? 'ring-4 ring-blue-600' : 'hover:opacity-80'
                                    }`}
                            >
                                <img src={img} alt={`${hotel.name} ${idx + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Hotel Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold dark:text-white mb-2">{hotel.name}</h1>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <FaMapMarkerAlt />
                                        <span>{hotel.address || `${hotel.city}, ${hotel.state}`}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleFavorite}
                                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {isFavorite ? (
                                        <FaHeart className="h-6 w-6 text-red-500" />
                                    ) : (
                                        <FaRegHeart className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                    )}
                                </button>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold">
                                    <FaStar className="h-5 w-5" />
                                    {hotel.rating || 'N/A'}
                                </div>
                                <div>
                                    <p className="font-semibold dark:text-white">{hotel.ratingText || 'Good'}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {hotel.ratingCount || 0} reviews
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <h2 className="text-2xl font-bold dark:text-white mb-4">About this hotel</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {hotel.description || `Welcome to ${hotel.name}, a premier hotel located in ${hotel.city}, ${hotel.state}. Experience luxury and comfort with our exceptional amenities and services.`}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <h2 className="text-2xl font-bold dark:text-white mb-4">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {hotel.amenities.map((amenity, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <amenity.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <span className="text-sm font-medium dark:text-white">{amenity.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24">
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting from</p>
                                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{hotel.priceRange || '₹5,000'}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">per night</p>
                            </div>

                            <button
                                onClick={handleBookNow}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                            >
                                <ShoppingCartIcon className="h-6 w-6" />
                                Book Now
                            </button>

                            <div className="mt-6 pt-6 border-t dark:border-gray-700">
                                <h3 className="font-bold dark:text-white mb-3">Quick Facts</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Location</span>
                                        <span className="font-medium dark:text-white">{hotel.city}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Distance</span>
                                        <span className="font-medium dark:text-white">{hotel.distance || 'City Center'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
