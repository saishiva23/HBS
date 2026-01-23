import { createContext, useContext, useState } from 'react';

// Sample hotels managed by the hotelier
const hotelierHotels = [
    {
        id: 1,
        name: 'Grand Luxury Hotel',
        location: 'New York, NY',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop',
        totalRooms: 150,
        rating: 4.8,
    },
    {
        id: 2,
        name: 'Sunset Beach Resort',
        location: 'Miami, FL',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=100&h=100&fit=crop',
        totalRooms: 85,
        rating: 4.6,
    },
    {
        id: 3,
        name: 'Mountain View Lodge',
        location: 'Denver, CO',
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=100&h=100&fit=crop',
        totalRooms: 45,
        rating: 4.9,
    },
];

const HotelContext = createContext();

export const HotelProvider = ({ children }) => {
    const [hotels] = useState(hotelierHotels);
    const [selectedHotel, setSelectedHotel] = useState(hotelierHotels[0]);

    const selectHotel = (hotelId) => {
        const hotel = hotels.find(h => h.id === hotelId);
        if (hotel) {
            setSelectedHotel(hotel);
        }
    };

    return (
        <HotelContext.Provider value={{
            hotels,
            selectedHotel,
            selectHotel,
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
