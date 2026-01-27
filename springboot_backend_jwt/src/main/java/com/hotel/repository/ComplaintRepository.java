package com.hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hotel.entities.Complaint;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByHotelId(Long hotelId);

    List<Complaint> findByUserId(Long userId);

    List<Complaint> findByStatus(String status);
}
