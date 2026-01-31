package com.hotel.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hotel.entities.RoomOccupancy;

public interface RoomOccupancyRepository extends JpaRepository<RoomOccupancy, Long> {

       @Query("SELECT ro FROM RoomOccupancy ro WHERE ro.room.hotel.id = :hotelId AND ro.room.roomType.id = :roomTypeId "
                     +
                     "AND ro.status = 'ACTIVE' AND ((ro.checkInDate < :checkOut AND ro.checkOutDate > :checkIn))")
       List<RoomOccupancy> findOverlappingOccupancies(@Param("hotelId") Long hotelId,
                     @Param("roomTypeId") Long roomTypeId,
                     @Param("checkIn") LocalDate checkIn,
                     @Param("checkOut") LocalDate checkOut);

       @Query("SELECT COUNT(DISTINCT ro.room.id) FROM RoomOccupancy ro WHERE ro.room.hotel.id = :hotelId " +
                     "AND ro.room.roomType.id = :roomTypeId AND ro.status = 'ACTIVE' " +
                     "AND ((ro.checkInDate < :checkOut AND ro.checkOutDate > :checkIn))")
       Long countOccupiedRoomsByType(@Param("hotelId") Long hotelId,
                     @Param("roomTypeId") Long roomTypeId,
                     @Param("checkIn") LocalDate checkIn,
                     @Param("checkOut") LocalDate checkOut);

       @Query("SELECT COUNT(DISTINCT ro.room.id) FROM RoomOccupancy ro WHERE ro.room.hotel.id = :hotelId " +
                     "AND ro.status = 'ACTIVE' " +
                     "AND ((ro.checkInDate < :checkOut AND ro.checkOutDate > :checkIn))")
       Long countOccupiedRoomsByHotel(@Param("hotelId") Long hotelId,
                     @Param("checkIn") LocalDate checkIn,
                     @Param("checkOut") LocalDate checkOut);

       List<RoomOccupancy> findByBookingId(Long bookingId);

       @Query("SELECT ro FROM RoomOccupancy ro WHERE ro.status = 'ACTIVE' AND ro.checkOutDate <= :today")
       List<RoomOccupancy> findAllExpiredOccupancies(@Param("today") LocalDate today);

       @Query("SELECT ro FROM RoomOccupancy ro WHERE ro.room.hotel.id = :hotelId AND ro.status = 'ACTIVE' " +
                     "AND ro.checkOutDate <= :today")
       List<RoomOccupancy> findExpiredOccupanciesByHotel(@Param("hotelId") Long hotelId,
                     @Param("today") LocalDate today);
}