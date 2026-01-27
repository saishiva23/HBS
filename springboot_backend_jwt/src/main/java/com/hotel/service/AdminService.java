package com.hotel.service;

import java.util.List;

import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.BookingResponseDTO;
import com.hotel.entities.Hotel;
import com.hotel.entities.User;

public interface AdminService {
    // Hotel Approval
    List<Hotel> getAllHotels();

    List<Hotel> getPendingHotels();

    List<Hotel> getApprovedHotels();

    List<Hotel> getRejectedHotels();

    ApiResponse approveHotel(Long hotelId);

    ApiResponse rejectHotel(Long hotelId, String reason);

    void deleteHotel(Long hotelId);

    // Payment Management
    List<BookingResponseDTO> getAllPayments();

    List<BookingResponseDTO> getPendingPayments();

    List<BookingResponseDTO> getCompletedPayments();

    List<BookingResponseDTO> getFailedPayments();

    // User Management
    List<User> getAllUsers();

    List<User> getSuspendedUsers();

    ApiResponse suspendUser(Long userId, String reason);

    ApiResponse activateUser(Long userId);

    // Analytics
    com.hotel.dtos.AdminAnalyticsDTO getAnalytics();

    // Recent Activity
    List<User> getRecentCustomers();

    List<Hotel> getRecentHotels();

    // Location Management
    java.util.List<com.hotel.dtos.LocationDTO> getAllLocations();

    com.hotel.entities.Location addLocation(com.hotel.entities.Location location);

    com.hotel.entities.Location updateLocation(Long id, com.hotel.entities.Location location);

    void deleteLocation(Long id);
}
