package com.hotel.service;

import java.util.List;

import com.hotel.entities.Hotel;
import com.hotel.entities.RoomType;
import com.hotel.dtos.HotelDTO;
import com.hotel.dtos.RoomTypeDTO;

public interface HotelService {
    List<Hotel> getAllHotels();

    Hotel getHotelDetails(Long id);

    List<Hotel> searchHotels(String city, String state, String destination);

    List<RoomType> getHotelRooms(Long hotelId);

    Boolean checkRoomAvailability(Long hotelId, Long roomTypeId, String checkIn, String checkOut, Integer rooms);

    Hotel addNewHotel(HotelDTO hotelDTO, String ownerEmail);

    List<Hotel> getHotelsByStatus(String status);

    Hotel updateHotelStatus(Long hotelId, String status);

    List<com.hotel.dtos.DestinationDTO> getPopularDestinations(String type); // type: city, state

    Hotel registerHotelWithUser(com.hotel.dtos.HotelRegistrationDTO registrationDTO);

    com.hotel.dtos.AuthResp registerHotelWithUserAndAuthenticate(com.hotel.dtos.HotelRegistrationDTO registrationDTO);
}
