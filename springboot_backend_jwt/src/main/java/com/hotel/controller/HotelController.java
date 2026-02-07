package com.hotel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dtos.HotelDTO;
import com.hotel.dtos.HotelRegistrationDTO;
import com.hotel.dtos.RoomTypeDTO;
import com.hotel.entities.Hotel;
import com.hotel.entities.RoomType;
import com.hotel.service.HotelService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
        "http://localhost:5175" })
@RequiredArgsConstructor
@Tag(name = "Hotels", description = "Hotel search, details, room availability, and registration endpoints")
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    @Operation(summary = "Get all hotels", description = "Retrieves a complete list of all hotels in the system")
    @ApiResponse(responseCode = "200", description = "Hotels retrieved successfully")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get hotels by status", description = "Retrieves hotels filtered by their approval status (e.g., APPROVED, PENDING, REJECTED)")
    @ApiResponse(responseCode = "200", description = "Hotels retrieved successfully")
    public ResponseEntity<List<Hotel>> getHotelsByStatus(
            @Parameter(description = "Hotel status", example = "APPROVED") @PathVariable String status) {
        return ResponseEntity.ok(hotelService.getHotelsByStatus(status));
    }

    @GetMapping("/search")
    @Operation(summary = "Search hotels", description = "Search for hotels by city, state, or destination. All parameters are optional.")
    @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    public ResponseEntity<List<Hotel>> searchHotels(
            @Parameter(description = "City name", example = "Mumbai") @RequestParam(required = false) String city,
            @Parameter(description = "State name", example = "Maharashtra") @RequestParam(required = false) String state,
            @Parameter(description = "Destination name", example = "Gateway of India") @RequestParam(required = false) String destination) {
        return ResponseEntity.ok(hotelService.searchHotels(city, state, destination));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get hotel details", description = "Retrieves detailed information about a specific hotel including rooms, amenities, and location")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hotel details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<Hotel> getHotelDetails(
            @Parameter(description = "Hotel ID", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelDetails(id));
    }

    @GetMapping("/{id}/rooms")
    @Operation(summary = "Get hotel room types", description = "Retrieves all room types available at a specific hotel")
    @ApiResponse(responseCode = "200", description = "Room types retrieved successfully")
    public ResponseEntity<List<RoomType>> getHotelRooms(
            @Parameter(description = "Hotel ID") @PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelRooms(id));
    }

    @GetMapping("/{hotelId}/rooms/{roomTypeId}/availability")
    @Operation(summary = "Check room availability", description = "Checks if a specific number of rooms are available for the given dates")
    @ApiResponse(responseCode = "200", description = "Availability status retrieved")
    public ResponseEntity<Boolean> checkRoomAvailability(
            @Parameter(description = "Hotel ID") @PathVariable Long hotelId,
            @Parameter(description = "Room Type ID") @PathVariable Long roomTypeId,
            @Parameter(description = "Check-in date", example = "2024-12-01") @RequestParam String checkIn,
            @Parameter(description = "Check-out date", example = "2024-12-05") @RequestParam String checkOut,
            @Parameter(description = "Number of rooms", example = "2") @RequestParam Integer rooms) {
        return ResponseEntity.ok(hotelService.checkRoomAvailability(hotelId, roomTypeId, checkIn, checkOut, rooms));
    }

    @PostMapping("/register")
    @PreAuthorize("hasAuthority('ROLE_HOTEL_MANAGER') or hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Register hotel (authenticated)", description = "Registers a new hotel by an authenticated hotel manager or admin")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hotel registered successfully"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<Hotel> registerHotel(@RequestBody @Valid HotelDTO hotelDTO,
            java.security.Principal principal) {
        return ResponseEntity.ok(hotelService.addNewHotel(hotelDTO, principal.getName()));
    }

    @PostMapping("/register-public")
    @Operation(summary = "Public hotel registration", description = "Allows public registration of a hotel with automatic user account creation. Returns authentication token.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hotel and user registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or email already exists")
    })
    public ResponseEntity<com.hotel.dtos.AuthResp> registerHotelPublic(
            @RequestBody @Valid HotelRegistrationDTO registrationDTO) {
        return ResponseEntity.ok(hotelService.registerHotelWithUserAndAuthenticate(registrationDTO));
    }

    @org.springframework.web.bind.annotation.PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update hotel status", description = "Updates the approval status of a hotel (Admin only)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hotel status updated successfully"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<Hotel> updateHotelStatus(
            @Parameter(description = "Hotel ID") @PathVariable Long id,
            @Parameter(description = "New status", example = "APPROVED") @RequestParam String status) {
        return ResponseEntity.ok(hotelService.updateHotelStatus(id, status));
    }

    @GetMapping("/destinations")
    @Operation(summary = "Get popular destinations", description = "Retrieves a list of popular destinations based on hotel locations. Type can be 'city' or 'state'.")
    @ApiResponse(responseCode = "200", description = "Destinations retrieved successfully")
    public ResponseEntity<List<com.hotel.dtos.DestinationDTO>> getPopularDestinations(
            @Parameter(description = "Destination type", example = "city") @RequestParam(defaultValue = "city") String type) {
        return ResponseEntity.ok(hotelService.getPopularDestinations(type));
    }
}
