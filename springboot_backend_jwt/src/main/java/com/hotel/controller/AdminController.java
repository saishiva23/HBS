package com.hotel.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.BookingResponseDTO;
import com.hotel.entities.Hotel;
import com.hotel.entities.User;
import com.hotel.service.AdminService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
        "http://localhost:5175" })
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Slf4j
public class AdminController {

    private final AdminService adminService;

    // Hotel Approval Management
    @GetMapping("/hotels")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(adminService.getAllHotels());
    }

    @GetMapping("/hotels/pending")
    public ResponseEntity<List<Hotel>> getPendingHotels() {
        log.info("Getting pending hotels");
        return ResponseEntity.ok(adminService.getPendingHotels());
    }

    @PatchMapping("/hotels/{id}/approve")
    public ResponseEntity<ApiResponse> approveHotel(@PathVariable Long id) {
        log.info("Approving hotel ID: {}", id);
        return ResponseEntity.ok(adminService.approveHotel(id));
    }

    @PatchMapping("/hotels/{id}/reject")
    public ResponseEntity<ApiResponse> rejectHotel(@PathVariable Long id, @RequestParam String reason) {
        log.info("Rejecting hotel ID: {} with reason: {}", id, reason);
        return ResponseEntity.ok(adminService.rejectHotel(id, reason));
    }

    @DeleteMapping("/hotels/{id}")
    public ResponseEntity<ApiResponse> deleteHotel(@PathVariable Long id) {
        adminService.deleteHotel(id);
        return ResponseEntity.ok(new ApiResponse("Success", "Hotel deleted successfully"));
    }

    @GetMapping("/hotels/approved")
    public ResponseEntity<List<Hotel>> getApprovedHotels() {
        return ResponseEntity.ok(adminService.getApprovedHotels());
    }

    @GetMapping("/hotels/rejected")
    public ResponseEntity<List<Hotel>> getRejectedHotels() {
        return ResponseEntity.ok(adminService.getRejectedHotels());
    }

    // Payment Management
    @GetMapping("/payments")
    public ResponseEntity<List<BookingResponseDTO>> getAllPayments() {
        log.info("Getting all payments");
        return ResponseEntity.ok(adminService.getAllPayments());
    }

    @GetMapping("/payments/pending")
    public ResponseEntity<List<BookingResponseDTO>> getPendingPayments() {
        return ResponseEntity.ok(adminService.getPendingPayments());
    }

    @GetMapping("/payments/completed")
    public ResponseEntity<List<BookingResponseDTO>> getCompletedPayments() {
        return ResponseEntity.ok(adminService.getCompletedPayments());
    }

    @GetMapping("/payments/failed")
    public ResponseEntity<List<BookingResponseDTO>> getFailedPayments() {
        return ResponseEntity.ok(adminService.getFailedPayments());
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        log.info("Getting all users");
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/suspend")
    public ResponseEntity<ApiResponse> suspendUser(@PathVariable Long id, @RequestParam String reason) {
        log.info("Suspending user ID: {} with reason: {}", id, reason);
        return ResponseEntity.ok(adminService.suspendUser(id, reason));
    }

    @PatchMapping("/users/{id}/activate")
    public ResponseEntity<ApiResponse> activateUser(@PathVariable Long id) {
        log.info("Activating user ID: {}", id);
        return ResponseEntity.ok(adminService.activateUser(id));
    }

    @GetMapping("/users/suspended")
    public ResponseEntity<List<User>> getSuspendedUsers() {
        return ResponseEntity.ok(adminService.getSuspendedUsers());
    }

    @GetMapping("/analytics")
    public ResponseEntity<com.hotel.dtos.AdminAnalyticsDTO> getAnalytics() {
        log.info("Getting admin analytics");
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    // Recent Activity
    @GetMapping("/users/recent")
    public ResponseEntity<List<User>> getRecentCustomers() {
        return ResponseEntity.ok(adminService.getRecentCustomers());
    }

    @GetMapping("/hotels/recent")
    public ResponseEntity<List<Hotel>> getRecentHotels() {
        return ResponseEntity.ok(adminService.getRecentHotels());
    }

    // Location Management
    @GetMapping("/locations")
    public ResponseEntity<List<com.hotel.dtos.LocationDTO>> getAllLocations() {
        return ResponseEntity.ok(adminService.getAllLocations());
    }

    @PostMapping("/locations")
    public ResponseEntity<com.hotel.entities.Location> addLocation(@RequestBody com.hotel.entities.Location location) {
        return ResponseEntity.ok(adminService.addLocation(location));
    }

    @PutMapping("/locations/{id}")
    public ResponseEntity<com.hotel.entities.Location> updateLocation(@PathVariable Long id,
            @RequestBody com.hotel.entities.Location location) {
        return ResponseEntity.ok(adminService.updateLocation(id, location));
    }

    @DeleteMapping("/locations/{id}")
    public ResponseEntity<ApiResponse> deleteLocation(@PathVariable Long id) {
        adminService.deleteLocation(id);
        return ResponseEntity.ok(new ApiResponse("Success", "Location deleted successfully"));
    }
}
