package com.hotel.controller;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dtos.AvailabilityDTO;
import com.hotel.repository.RoomOccupancyRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.service.RoomOccupancyService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class AvailabilityController {

        private final RoomOccupancyService roomOccupancyService;
        private final RoomRepository roomRepository;
        private final RoomOccupancyRepository roomOccupancyRepository;

        @GetMapping("/hotel/{hotelId}/room-type/{roomTypeId}")
        public ResponseEntity<AvailabilityDTO> checkAvailability(
                        @PathVariable Long hotelId,
                        @PathVariable Long roomTypeId,
                        @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate checkIn,
                        @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate checkOut,
                        @RequestParam(defaultValue = "1") Integer rooms) {

                log.info("Checking availability for hotel {} room type {} from {} to {} for {} rooms",
                                hotelId, roomTypeId, checkIn, checkOut, rooms);

                try {
                        // Check if room type is available for the requested count
                        boolean available = roomOccupancyService.isRoomTypeAvailable(
                                        hotelId, roomTypeId, checkIn, checkOut, rooms);

                        // Get total and occupied rooms
                        Long totalRooms = roomRepository.countAvailableRooms(hotelId, roomTypeId);
                        Long occupiedRooms = roomOccupancyRepository.countOccupiedRoomsByType(
                                        hotelId, roomTypeId, checkIn, checkOut);

                        Long availableRoomsCount = totalRooms - occupiedRooms;

                        AvailabilityDTO response = new AvailabilityDTO(
                                        available,
                                        availableRoomsCount,
                                        totalRooms);

                        log.info("Availability check result: {} rooms available out of {}", availableRoomsCount,
                                        totalRooms);

                        return ResponseEntity.ok(response);
                } catch (Exception e) {
                        log.error("Error checking availability", e);
                        // Return unavailable on error
                        return ResponseEntity.ok(new AvailabilityDTO(false, 0L, 0L, "Error checking availability"));
                }
        }

        @GetMapping("/hotel/{hotelId}/room-type/{roomTypeId}/batch")
        public ResponseEntity<Map<String, Boolean>> checkBatchAvailability(
                        @PathVariable Long hotelId,
                        @PathVariable Long roomTypeId,
                        @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate startDate,
                        @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate endDate,
                        @RequestParam(defaultValue = "1") Integer rooms) {

                log.info("Checking batch availability for hotel {} room type {} from {} to {}",
                                hotelId, roomTypeId, startDate, endDate);

                Map<String, Boolean> availability = new java.util.HashMap<>();

                try {
                        LocalDate current = startDate;
                        while (!current.isAfter(endDate)) {
                                LocalDate nextDay = current.plusDays(1);
                                boolean available = roomOccupancyService.isRoomTypeAvailable(
                                                hotelId, roomTypeId, current, nextDay, rooms);

                                availability.put(current.toString(), available);
                                current = current.plusDays(1);
                        }

                        log.info("Batch availability check completed for {} dates", availability.size());
                        return ResponseEntity.ok(availability);
                } catch (Exception e) {
                        log.error("Error checking batch availability", e);
                        return ResponseEntity.ok(new java.util.HashMap<>());
                }
        }
}
