package com.hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.entities.Hotel;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByCityContainingIgnoreCase(String city);

    List<Hotel> findByStatus(String status);

    List<Hotel> findByOwnerId(Long ownerId);

    List<Hotel> findByCity(String city);
}
