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

    // Case-insensitive hotel name search
    List<Hotel> findByNameContainingIgnoreCaseAndStatus(String name, String status);

    // Combined case-insensitive search across name, city, or state
    @org.springframework.data.jpa.repository.Query("SELECT h FROM Hotel h WHERE h.status = :status AND " +
            "(LOWER(h.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(h.city) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(h.state) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Hotel> searchByNameCityOrState(
            @org.springframework.data.repository.query.Param("searchTerm") String searchTerm,
            @org.springframework.data.repository.query.Param("status") String status);
}
