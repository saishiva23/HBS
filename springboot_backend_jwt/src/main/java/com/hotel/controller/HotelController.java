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

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
        "http://localhost:5175" })
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Hotel>> getHotelsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(hotelService.getHotelsByStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelDetails(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelDetails(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> searchHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String destination) {
        return ResponseEntity.ok(hotelService.searchHotels(city, state, destination));
    }

    @GetMapping("/{id}/rooms")
    public ResponseEntity<List<RoomType>> getHotelRooms(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelRooms(id));
    }

    @GetMapping("/{hotelId}/rooms/{roomTypeId}/availability")
    public ResponseEntity<Boolean> checkRoomAvailability(
            @PathVariable Long hotelId,
            @PathVariable Long roomTypeId,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam Integer rooms) {
        return ResponseEntity.ok(hotelService.checkRoomAvailability(hotelId, roomTypeId, checkIn, checkOut, rooms));
    }

    @PostMapping("/register")
    @PreAuthorize("hasAuthority('ROLE_HOTEL_MANAGER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Hotel> registerHotel(@RequestBody @Valid HotelDTO hotelDTO,
            java.security.Principal principal) {
        return ResponseEntity.ok(hotelService.addNewHotel(hotelDTO, principal.getName()));
    }

    @PostMapping("/register-public")
    public ResponseEntity<com.hotel.dtos.AuthResp> registerHotelPublic(
            @RequestBody @Valid HotelRegistrationDTO registrationDTO) {
        return ResponseEntity.ok(hotelService.registerHotelWithUserAndAuthenticate(registrationDTO));
    }

    @org.springframework.web.bind.annotation.PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Hotel> updateHotelStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(hotelService.updateHotelStatus(id, status));
    }

    @GetMapping("/destinations")
    public ResponseEntity<List<com.hotel.dtos.DestinationDTO>> getPopularDestinations(
            @RequestParam(defaultValue = "city") String type) {
        return ResponseEntity.ok(hotelService.getPopularDestinations(type));
    }
}
