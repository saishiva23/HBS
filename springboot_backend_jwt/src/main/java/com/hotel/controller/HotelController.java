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
import com.hotel.dtos.RoomTypeDTO;
import com.hotel.entities.Hotel;
import com.hotel.entities.RoomType;
import com.hotel.service.HotelService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
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

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_HOTEL_MANAGER')")
    public ResponseEntity<Hotel> createHotel(@RequestBody @Valid HotelDTO hotelDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(hotelService.createHotel(hotelDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_HOTEL_MANAGER')")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody @Valid HotelDTO hotelDTO) {
        return ResponseEntity.ok(hotelService.updateHotel(id, hotelDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_HOTEL_MANAGER')")
    public ResponseEntity<?> deleteHotel(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.deleteHotel(id));
    }

    @PostMapping("/{id}/rooms")
    @PreAuthorize("hasAuthority('ROLE_HOTEL_MANAGER')")
    public ResponseEntity<RoomType> addRoomType(@PathVariable Long id, @RequestBody @Valid RoomTypeDTO roomTypeDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(hotelService.addRoomType(id, roomTypeDTO));
    }
}
