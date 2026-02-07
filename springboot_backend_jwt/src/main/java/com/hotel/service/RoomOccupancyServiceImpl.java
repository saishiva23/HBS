package com.hotel.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.entities.Room;
import com.hotel.entities.Booking;
import com.hotel.entities.RoomOccupancy;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.RoomOccupancyRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RoomOccupancyServiceImpl implements RoomOccupancyService {

    private final RoomRepository roomRepository;
    private final RoomOccupancyRepository roomOccupancyRepository;

    @Override
    public void createRoomOccupancy(Booking booking) {
        List<Room> availableRooms = getAvailableRooms(
                booking.getHotel().getId(),
                booking.getRoomType().getId(),
                booking.getCheckInDate(),
                booking.getCheckOutDate());

        if (availableRooms.size() < booking.getRooms()) {
            throw new IllegalStateException("Not enough available rooms for the booking period");
        }

        // Create occupancy records for required number of rooms
        for (int i = 0; i < booking.getRooms() && i < availableRooms.size(); i++) {
            Room room = availableRooms.get(i);

            RoomOccupancy occupancy = new RoomOccupancy();
            occupancy.setRoom(room);
            occupancy.setBooking(booking);
            occupancy.setCheckInDate(booking.getCheckInDate());
            occupancy.setCheckOutDate(booking.getCheckOutDate());
            occupancy.setStatus("ACTIVE");

            roomOccupancyRepository.save(occupancy);
            
            // Update room status to OCCUPIED
            room.setStatus("OCCUPIED");
            roomRepository.save(room);
            
            log.info("Room {} occupied from {} to {} for booking {}",
                    room.getRoomNumber(), booking.getCheckInDate(), booking.getCheckOutDate(), booking.getId());
        }
    }

    @Override
    public void cancelRoomOccupancy(Long bookingId) {
        List<RoomOccupancy> occupancies = roomOccupancyRepository.findByBookingId(bookingId);

        for (RoomOccupancy occupancy : occupancies) {
            occupancy.setStatus("CANCELLED");
            roomOccupancyRepository.save(occupancy);
            
            // Update room status back to AVAILABLE
            Room room = occupancy.getRoom();
            room.setStatus("AVAILABLE");
            roomRepository.save(room);
            
            log.info("Room occupancy cancelled for room {} and booking {}",
                    occupancy.getRoom().getRoomNumber(), bookingId);
        }
    }

    @Override
    public boolean isRoomTypeAvailable(Long hotelId, Long roomTypeId, LocalDate checkIn, LocalDate checkOut,
            Integer roomCount) {
        Long totalRooms = roomRepository.countAvailableRooms(hotelId, roomTypeId);
        Long occupiedRooms = roomOccupancyRepository.countOccupiedRoomsByType(hotelId, roomTypeId, checkIn, checkOut);

        Long availableRooms = totalRooms - occupiedRooms;
        return availableRooms >= roomCount;
    }

    @Override
    public List<Room> getAvailableRooms(Long hotelId, Long roomTypeId, LocalDate checkIn, LocalDate checkOut) {
        List<Room> allRooms = roomRepository.findAvailableRooms(hotelId, roomTypeId);
        List<RoomOccupancy> overlappingOccupancies = roomOccupancyRepository.findOverlappingOccupancies(
                hotelId, roomTypeId, checkIn, checkOut);

        List<Long> occupiedRoomIds = overlappingOccupancies.stream()
                .map(ro -> ro.getRoom().getId())
                .collect(Collectors.toList());

        return allRooms.stream()
                .filter(room -> !occupiedRoomIds.contains(room.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public void processExpiredOccupancies() {
        // This method can be called by a scheduled task to mark expired occupancies as
        // completed
        LocalDate today = LocalDate.now();
        List<RoomOccupancy> expiredOccupancies = roomOccupancyRepository.findAllExpiredOccupancies(today);

        for (RoomOccupancy occupancy : expiredOccupancies) {
            occupancy.setStatus("COMPLETED");
            roomOccupancyRepository.save(occupancy);
            
            // Update room status back to AVAILABLE after checkout
            Room room = occupancy.getRoom();
            room.setStatus("AVAILABLE");
            roomRepository.save(room);
            
            log.info("Room occupancy completed for room {} after checkout date",
                    occupancy.getRoom().getRoomNumber());
        }
    }

    @Override
    public Long getOccupiedRoomCount(Long hotelId) {
        LocalDate today = LocalDate.now();
        return roomOccupancyRepository.countOccupiedRoomsByHotel(hotelId, today, today.plusDays(1));
    }
}