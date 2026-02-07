package com.hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.entities.Hotel;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByCityContainingIgnoreCase(String city);

    List<Hotel> findByCityContainingIgnoreCaseAndStatus(String city, String status);

    List<Hotel> findByStatus(String status);

    List<Hotel> findByOwnerId(Long ownerId);

    // Soft delete aware queries - exclude soft deleted by default
    List<Hotel> findByOwnerIdAndIsDeletedFalse(Long ownerId);

    // Include soft deleted hotels for admin/restore functionality
    List<Hotel> findByOwnerIdAndIsDeletedTrue(Long ownerId);

    List<Hotel> findByCity(String city);
}
