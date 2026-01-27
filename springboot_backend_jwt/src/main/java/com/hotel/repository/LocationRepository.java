package com.hotel.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.entities.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByCity(String city);
}
