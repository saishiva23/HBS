package com.hotel.service;

import java.util.List;
import java.util.Map;

import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.BookingResponseDTO;
import com.hotel.dtos.HotelDTO;
import com.hotel.dtos.RoomTypeDTO;
import com.hotel.entities.Hotel;
import com.hotel.entities.RoomType;

public interface HotelOwnerService {
    // Hotel Management
    List<Hotel> getOwnerHotels(String ownerEmail);

    Hotel getOwnerHotelDetails(Long hotelId, String ownerEmail);

    Hotel createHotel(HotelDTO hotelDTO, String ownerEmail);

    Hotel updateHotel(Long hotelId, HotelDTO hotelDTO, String ownerEmail);

    ApiResponse deleteHotel(Long hotelId, String ownerEmail);

    // Room Type Management
    List<RoomType> getHotelRooms(Long hotelId, String ownerEmail);

    RoomType addRoomType(Long hotelId, RoomTypeDTO roomTypeDTO, String ownerEmail);

    RoomType updateRoomType(Long hotelId, Long roomTypeId, RoomTypeDTO roomTypeDTO, String ownerEmail);

    ApiResponse deleteRoomType(Long hotelId, Long roomTypeId, String ownerEmail);

    // Individual Room Management
    List<com.hotel.dtos.RoomResponseDTO> getHotelRoomsList(Long hotelId, String ownerEmail);

    com.hotel.entities.Room addRoom(Long hotelId, com.hotel.dtos.RoomDTO roomDTO, String ownerEmail);

    com.hotel.entities.Room updateRoom(Long hotelId, Long roomId, com.hotel.dtos.RoomDTO roomDTO, String ownerEmail);

    ApiResponse deleteRoom(Long hotelId, Long roomId, String ownerEmail);

    // Room Statistics
    com.hotel.dtos.RoomStatsDTO getRoomStats(Long hotelId, String ownerEmail);

    // Booking Management
    List<BookingResponseDTO> getOwnerBookings(String ownerEmail);

    List<BookingResponseDTO> getHotelBookings(Long hotelId, String ownerEmail);

    ApiResponse updateBookingStatus(Long bookingId, String status, String ownerEmail);

    // Dashboard
    Map<String, Object> getOwnerDashboardStats(String ownerEmail);

    // Customer Experience - Reviews
    List<com.hotel.dtos.ReviewResponseDTO> getHotelReviews(Long hotelId, String ownerEmail);

    Map<String, Object> getReviewStats(Long hotelId, String ownerEmail);

    // Customer Experience - Complaints
    List<com.hotel.dtos.ComplaintResponseDTO> getHotelComplaints(Long hotelId, String ownerEmail);

    ApiResponse resolveComplaint(Long complaintId, String resolution, String ownerEmail);

    // Payment Management
    List<BookingResponseDTO> getPaymentHistory(Long hotelId, String ownerEmail);

    Map<String, Object> getPaymentStats(Long hotelId, String ownerEmail);

    byte[] generatePaymentReport(Long hotelId, String ownerEmail);
}
