import { createContext, useContext, useState, useEffect } from 'react';
import { ownerAPI } from '../services/completeAPI';

const HotelContext = createContext();

export const HotelProvider = ({ children }) => {
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch owner's hotels from backend
    const fetchHotels = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('[HotelContext] Fetching owner hotels from API...');

            const data = await ownerAPI.getMyHotels();
            console.log('[HotelContext] Fetched hotels:', data);

            // Transform backend data to match expected format
            const transformedHotels = data.map(hotel => ({
                id: hotel.id,
                name: hotel.name,
                location: `${hotel.city}, ${hotel.state}`,
                city: hotel.city,
                state: hotel.state,
                address: hotel.address,
                status: hotel.status,
                image: hotel.images
                    ? (typeof hotel.images === 'string' ? JSON.parse(hotel.images)[0] : hotel.images[0])
                    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop',
                totalRooms: hotel.totalRooms || 0,
                rating: hotel.rating || 0,
                description: hotel.description,
                amenities: {
                    wifi: hotel.wifi,
                    parking: hotel.parking,
                    gym: hotel.gym,
                    ac: hotel.ac,
                    restaurant: hotel.restaurant,
                    roomService: hotel.roomService
                }
            }));

            setHotels(transformedHotels);

            // Auto-select first hotel if none selected
            if (!selectedHotel && transformedHotels.length > 0) {
                setSelectedHotel(transformedHotels[0]);
                console.log('[HotelContext] Auto-selected first hotel:', transformedHotels[0].name);
            }
        } catch (err) {
            console.error('[HotelContext] Failed to fetch hotels:', err);
            setError(err.message || 'Failed to load hotels');
            setHotels([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch hotels on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                // Only fetch owner hotels if the user is a HOTEL_MANAGER
                if (user.role === 'ROLE_HOTEL_MANAGER') {
                    fetchHotels();
                } else {
                    console.log('[HotelContext] User is not a manager, skipping owner hotel fetch');
                    setLoading(false);
                }
            } catch (e) {
                console.error('[HotelContext] Error parsing user details:', e);
                setLoading(false);
            }
        } else {
            console.warn('[HotelContext] No auth token found, skipping hotel fetch');
            setLoading(false);
        }

        // Auto-refresh hotel data when window regains focus
        // This ensures owners see updated hotel status after admin approval/deletion
        const handleFocus = () => {
            const currentToken = localStorage.getItem('token');
            const currentUserStr = localStorage.getItem('user');
            
            if (currentToken && currentUserStr) {
                try {
                    const currentUser = JSON.parse(currentUserStr);
                    if (currentUser.role === 'ROLE_HOTEL_MANAGER') {
                        console.log('[HotelContext] Window focused, refreshing hotel data...');
                        fetchHotels();
                    }
                } catch (e) {
                    // Ignore parsing errors
                }
            }
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const selectHotel = (hotelId) => {
        const hotel = hotels.find(h => h.id === hotelId);
        if (hotel) {
            setSelectedHotel(hotel);
            console.log('[HotelContext] Selected hotel:', hotel.name);
        }
    };

    // Refresh hotel data (useful after creating/updating hotels)
    const refreshHotels = () => {
        fetchHotels();
    };

    return (
        <HotelContext.Provider value={{
            hotels,
            selectedHotel,
            selectHotel,
            refreshHotels,
            loading,
            error,
            hotelId: selectedHotel?.id
        }}>
            {children}
        </HotelContext.Provider>
    );
};

export const useHotel = () => {
    const context = useContext(HotelContext);
    if (!context) {
        throw new Error('useHotel must be used within a HotelProvider');
    }
    return context;
};

export default HotelContext;
