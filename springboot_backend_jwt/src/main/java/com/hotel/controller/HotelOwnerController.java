package com.hotel.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.BookingResponseDTO;
import com.hotel.dtos.HotelDTO;
import com.hotel.dtos.RoomTypeDTO;
import com.hotel.entities.Hotel;
import com.hotel.entities.RoomType;
import com.hotel.service.HotelOwnerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/owner")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
        "http://localhost:5175" })
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_HOTEL_MANAGER')")
@Slf4j
public class HotelOwnerController {

    private final HotelOwnerService hotelOwnerService;

    // Hotel Management
    @GetMapping("/hotels")
    public ResponseEntity<List<Hotel>> getMyHotels(Principal principal) {
        log.info("Getting hotels for owner: {}", principal.getName());
        return ResponseEntity.ok(hotelOwnerService.getOwnerHotels(principal.getName()));
    }

    @GetMapping("/hotels/{id}")
    public ResponseEntity<Hotel> getHotelDetails(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.getOwnerHotelDetails(id, principal.getName()));
    }

    @PostMapping("/hotels")
    public ResponseEntity<Hotel> createHotel(@RequestBody @Valid HotelDTO hotelDTO, Principal principal) {
        log.info("Creating hotel for owner: {}", principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(hotelOwnerService.createHotel(hotelDTO, principal.getName()));
    }

    @PutMapping("/hotels/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody @Valid HotelDTO hotelDTO,
            Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.updateHotel(id, hotelDTO, principal.getName()));
    }

    @DeleteMapping("/hotels/{id}")
    public ResponseEntity<ApiResponse> deleteHotel(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.deleteHotel(id, principal.getName()));
    }

    // Room Type Management
    @GetMapping("/hotels/{hotelId}/rooms")
    public ResponseEntity<List<RoomType>> getHotelRooms(@PathVariable Long hotelId, Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.getHotelRooms(hotelId, principal.getName()));
    }

    @PostMapping("/hotels/{hotelId}/rooms")
    public ResponseEntity<RoomType> addRoomType(@PathVariable Long hotelId,
            @RequestBody @Valid RoomTypeDTO roomTypeDTO, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(hotelOwnerService.addRoomType(hotelId, roomTypeDTO, principal.getName()));
    }

    @PutMapping("/hotels/{hotelId}/rooms/{roomId}")
    public ResponseEntity<RoomType> updateRoomType(@PathVariable Long hotelId, @PathVariable Long roomId,
            @RequestBody @Valid RoomTypeDTO roomTypeDTO, Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.updateRoomType(hotelId, roomId, roomTypeDTO, principal.getName()));
    }

    @DeleteMapping("/hotels/{hotelId}/rooms/{roomId}")
    public ResponseEntity<ApiResponse> deleteRoomType(@PathVariable Long hotelId, @PathVariable Long roomId,
            Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.deleteRoomType(hotelId, roomId, principal.getName()));
    }

    // Individual Room Management
    @GetMapping("/hotels/{hotelId}/room-list")
    public ResponseEntity<List<com.hotel.dtos.RoomResponseDTO>> getHotelRoomsList(@PathVariable Long hotelId,
            Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.getHotelRoomsList(hotelId, principal.getName()));
    }

    @PostMapping("/hotels/{hotelId}/room-list")
    public ResponseEntity<com.hotel.entities.Room> addRoom(@PathVariable Long hotelId,
            @RequestBody @Valid com.hotel.dtos.RoomDTO roomDTO, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(hotelOwnerService.addRoom(hotelId, roomDTO, principal.getName()));
    }

    @PutMapping("/hotels/{hotelId}/room-list/{roomId}")
    public ResponseEntity<com.hotel.entities.Room> updateRoom(@PathVariable Long hotelId, @PathVariable Long roomId,
            @RequestBody @Valid com.hotel.dtos.RoomDTO roomDTO, Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.updateRoom(hotelId, roomId, roomDTO, principal.getName()));
    }

    @DeleteMapping("/hotels/{hotelId}/room-list/{roomId}")
    public ResponseEntity<ApiResponse> deleteRoom(@PathVariable Long hotelId, @PathVariable Long roomId,
            Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.deleteRoom(hotelId, roomId, principal.getName()));
    }

    // Booking Management
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyHotelBookings(Principal principal) {
        log.info("Getting bookings for owner: {}", principal.getName());
        return ResponseEntity.ok(hotelOwnerService.getOwnerBookings(principal.getName()));
    }

    @GetMapping("/hotels/{hotelId}/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getHotelBookings(@PathVariable Long hotelId, Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.getHotelBookings(hotelId, principal.getName()));
    }

    @PatchMapping("/bookings/{bookingId}/status")
    public ResponseEntity<ApiResponse> updateBookingStatus(@PathVariable Long bookingId,
            @org.springframework.web.bind.annotation.RequestParam String status, Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.updateBookingStatus(bookingId, status, principal.getName()));
    }

    // Dashboard Stats
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.getOwnerDashboardStats(principal.getName()));
    }

    // Customer Experience - Reviews
    @GetMapping("/hotels/{hotelId}/reviews")
    public ResponseEntity<List<com.hotel.dtos.ReviewResponseDTO>> getHotelReviews(@PathVariable Long hotelId,
            Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.getHotelReviews(hotelId, principal.getName()));
    }

    @GetMapping("/hotels/{hotelId}/reviews/stats")
    public ResponseEntity<Map<String, Object>> getReviewStats(@PathVariable Long hotelId, Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.getReviewStats(hotelId, principal.getName()));
    }

    // Customer Experience - Complaints
    @GetMapping("/hotels/{hotelId}/complaints")
    public ResponseEntity<List<com.hotel.dtos.ComplaintResponseDTO>> getHotelComplaints(@PathVariable Long hotelId,
            Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.getHotelComplaints(hotelId, principal.getName()));
    }

    @PutMapping("/complaints/{complaintId}/resolve")
    public ResponseEntity<ApiResponse> resolveComplaint(@PathVariable Long complaintId,
            @RequestBody Map<String, String> payload, Principal principal) {
        String resolution = payload.get("resolution");
        return ResponseEntity.ok(hotelOwnerService.resolveComplaint(complaintId, resolution, principal.getName()));
    }

    // Payment Management
    @GetMapping("/hotels/{hotelId}/payments")
    public ResponseEntity<List<com.hotel.dtos.BookingResponseDTO>> getPaymentHistory(@PathVariable Long hotelId,
            Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.getPaymentHistory(hotelId, principal.getName()));
    }

    @GetMapping("/hotels/{hotelId}/payments/stats")
    public ResponseEntity<Map<String, Object>> getPaymentStats(@PathVariable Long hotelId, Principal principal) {
        return ResponseEntity.ok(hotelOwnerService.getPaymentStats(hotelId, principal.getName()));
    }
}
