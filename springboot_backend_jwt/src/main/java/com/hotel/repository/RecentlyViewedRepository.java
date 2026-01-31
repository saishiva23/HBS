package com.hotel.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hotel.entities.RecentlyViewed;

public interface RecentlyViewedRepository extends JpaRepository<RecentlyViewed, Long> {
    
    @Query("SELECT rv FROM RecentlyViewed rv JOIN FETCH rv.hotel h LEFT JOIN FETCH h.owner WHERE rv.user.id = :userId ORDER BY rv.viewedAt DESC")
    List<RecentlyViewed> findByUserIdOrderByViewedAtDesc(@Param("userId") Long userId);
    
    Optional<RecentlyViewed> findByUserIdAndHotelId(Long userId, Long hotelId);
    
    void deleteByUserIdAndHotelId(Long userId, Long hotelId);
}