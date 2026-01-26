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

    Hotel createHotel(HotelDTO hotelDTO);

    Hotel updateHotel(Long id, HotelDTO hotelDTO);

    com.hotel.dtos.ApiResponse deleteHotel(Long id);

    RoomType addRoomType(Long hotelId, RoomTypeDTO roomTypeDTO);
}
