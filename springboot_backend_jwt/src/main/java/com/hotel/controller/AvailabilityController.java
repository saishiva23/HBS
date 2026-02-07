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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Availability", description = "Room availability checking and batch availability endpoints")
public class AvailabilityController {

        private final RoomOccupancyService roomOccupancyService;
        private final RoomRepository roomRepository;
        private final RoomOccupancyRepository roomOccupancyRepository;

        @GetMapping("/hotel/{hotelId}/room-type/{roomTypeId}")
        @Operation(summary = "Check room availability", description = "Checks room availability for a specific hotel and room type across given dates")
        @ApiResponse(responseCode = "200", description = "Availability information retrieved")
        public ResponseEntity<AvailabilityDTO> checkAvailability(
                        @Parameter(description = "Hotel ID") @PathVariable Long hotelId,
                        @Parameter(description = "Room Type ID") @PathVariable Long roomTypeId,
                        @Parameter(description = "Check-in date", example = "2024-12-01") @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate checkIn,
                        @Parameter(description = "Check-out date", example = "2024-12-05") @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate checkOut,
                        @Parameter(description = "Number of rooms", example = "1") @RequestParam(defaultValue = "1") Integer rooms) {

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
        @Operation(summary = "Check batch availability", description = "Checks availability for each day in a date range, useful for calendar displays")
        @ApiResponse(responseCode = "200", description = "Batch availability data retrieved")
        public ResponseEntity<Map<String, Boolean>> checkBatchAvailability(
                        @Parameter(description = "Hotel ID") @PathVariable Long hotelId,
                        @Parameter(description = "Room Type ID") @PathVariable Long roomTypeId,
                        @Parameter(description = "Start date", example = "2024-12-01") @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate startDate,
                        @Parameter(description = "End date", example = "2024-12-31") @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate endDate,
                        @Parameter(description = "Number of rooms", example = "1") @RequestParam(defaultValue = "1") Integer rooms) {

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
