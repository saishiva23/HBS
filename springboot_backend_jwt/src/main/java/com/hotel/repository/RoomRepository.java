package com.hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hotel.entities.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelId(Long hotelId);

    List<Room> findByRoomTypeId(Long roomTypeId);

    @Query("SELECT COUNT(r) FROM Room r WHERE r.hotel.id = :hotelId AND r.roomType.id = :roomTypeId AND r.isActive = true")
    Long countAvailableRooms(@Param("hotelId") Long hotelId, @Param("roomTypeId") Long roomTypeId);

    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.roomType.id = :roomTypeId AND r.isActive = true")
    List<Room> findAvailableRooms(@Param("hotelId") Long hotelId, @Param("roomTypeId") Long roomTypeId);
}
