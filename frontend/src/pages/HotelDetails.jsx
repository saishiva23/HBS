import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaStar, FaWifi, FaParking, FaDumbbell, FaUtensils, FaSwimmingPool, FaArrowLeft } from 'react-icons/fa';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import customerAPI from '../services/customerAPI';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getDisplayImage, getImageArray } from '../utils/defaultImages';

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
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
            const roomsData = await customerAPI.hotels.getRooms(id);

            // Parse images - use default if none exist
            let images = [];
            try {
                images = typeof data.images === 'string' ? JSON.parse(data.images) : data.images || [];
            } catch {
                images = [];
            }
            // Get images with fallback to default hotel image
            images = getImageArray(images, 'hotel');

            // Parse amenities
            const amenities = [];
            if (data.wifi) amenities.push({ icon: FaWifi, name: 'Free WiFi' });
            if (data.parking) amenities.push({ icon: FaParking, name: 'Parking' });
            if (data.gym) amenities.push({ icon: FaDumbbell, name: 'Gym' });
            if (data.restaurant) amenities.push({ icon: FaUtensils, name: 'Restaurant' });
            if (data.pool) amenities.push({ icon: FaSwimmingPool, name: 'Pool' });

            setHotel({ ...data, images, amenities });
            setRooms(roomsData.map(rt => ({
                ...rt,
                amenities: typeof rt.amenities === 'string' ? JSON.parse(rt.amenities) : (rt.amenities || []),
                images: getImageArray(
                    typeof rt.images === 'string' ? JSON.parse(rt.images) : (rt.images || []),
                    rt.name // room type name for default image selection
                ),
            })));
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
        // Check authentication before allowing favorites
        if (!isAuthenticated) {
            toast.error('Please login to add favorites');
            navigate('/login', { state: { from: `/hotel/${id}` } });
            return;
        }

        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const hotelData = {
            id: hotel.id,
            name: hotel.name,
            city: hotel.city,
            state: hotel.state,
            image: hotel.images[0],
            price: rooms.length > 0 ? rooms[0].pricePerNight : 5000,
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

    const handleAddToCart = (roomType) => {
        if (!isAuthenticated) {
            toast.error('Please login to book');
            navigate('/login');
            return;
        }

        // Check if rooms are available
        if (!roomType.totalRooms || roomType.totalRooms === 0) {
            toast.error('No rooms available for this room type');
            return;
        }

        const bookingDetails = {
            hotel: hotel.name,
            hotelId: hotel.id,
            roomType: roomType.name,
            roomTypeId: roomType.id,
            basePrice: roomType.pricePerNight,
            price: roomType.pricePerNight, // Initial price for 1 night 1 room
            checkIn: 'Not selected',
            checkOut: 'Not selected',
            guests: roomType.capacity || 2,
            rooms: 1,
            nights: 1,
            image: hotel.images[0]
        };

        const existingCart = JSON.parse(localStorage.getItem('hotelCart') || '[]');
        existingCart.push(bookingDetails);
        localStorage.setItem('hotelCart', JSON.stringify(existingCart));

        window.dispatchEvent(new Event('cartUpdated'));
        toast.success(`${roomType.name} added to cart!`);
        navigate('/cart');
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
            toast.error('Please login to book');
            navigate('/login');
            return;
        }
        // Scroll to rooms section
        const element = document.getElementById('rooms-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
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

                        {/* Rooms Availability */}
                        <div id="rooms-section" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg scroll-mt-24">
                            <h2 className="text-2xl font-bold dark:text-white mb-6">Rooms & Availability</h2>
                            <div className="space-y-6">
                                {rooms.length > 0 ? (
                                    rooms.map((room) => (
                                        <div key={room.id} className="border dark:border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-colors">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                                                    <img 
                                                        src={getDisplayImage(room.images, room.name)} 
                                                        alt={room.name} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="text-xl font-bold dark:text-white">{room.name}</h3>
                                                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                                ₹{room.pricePerNight.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{room.description}</p>

                                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                            <div className="flex items-center gap-1">
                                                                <FaStar className="text-yellow-400" />
                                                                <span>Sleeps {room.capacity}</span>
                                                            </div>
                                                            {room.beds && (
                                                                <div className="flex items-center gap-1">
                                                                    <FaWifi className="text-blue-400" />
                                                                    <span>{room.beds}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {room.amenities.map((amenity, i) => (
                                                                <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                                                    {amenity}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 flex justify-end">
                                                        <button
                                                            onClick={() => handleAddToCart(room)}
                                                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
                                                        >
                                                            Select Room
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                                        <p className="text-gray-500 dark:text-gray-400">No rooms currently available for this hotel.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24">
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price per night</p>
                                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                    ₹{rooms.length > 0 ? Math.min(...rooms.map(r => r.pricePerNight)).toLocaleString() : '5,000'}
                                </p>
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
