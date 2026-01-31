package com.hotel.service;

import java.time.LocalDate;
import java.util.List;

import com.hotel.entities.Room;
import com.hotel.entities.Booking;

public interface RoomOccupancyService {
    void createRoomOccupancy(Booking booking);
    void cancelRoomOccupancy(Long bookingId);
    boolean isRoomTypeAvailable(Long hotelId, Long roomTypeId, LocalDate checkIn, LocalDate checkOut, Integer roomCount);
    List<Room> getAvailableRooms(Long hotelId, Long roomTypeId, LocalDate checkIn, LocalDate checkOut);
    void processExpiredOccupancies();
    Long getOccupiedRoomCount(Long hotelId);
}