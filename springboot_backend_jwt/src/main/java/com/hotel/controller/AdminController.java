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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
        "http://localhost:5175" })
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Slf4j
@Tag(name = "Admin", description = "Administrative endpoints for system management (Admin access required)")
public class AdminController {

    private final AdminService adminService;

    // Hotel Approval Management
    @GetMapping("/hotels")
    @Operation(summary = "Get all hotels", description = "Retrieves all hotels in the system regardless of status")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Hotels retrieved successfully")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(adminService.getAllHotels());
    }

    @GetMapping("/hotels/pending")
    @Operation(summary = "Get pending hotels", description = "Retrieves all hotels awaiting admin approval")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Pending hotels retrieved successfully")
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

    // Booking Management
    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings", description = "Retrieves all bookings in the system")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Bookings retrieved successfully")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        log.info("Getting all bookings");
        return ResponseEntity.ok(adminService.getAllBookings());
    }

    // Review Management
    @GetMapping("/reviews")
    @Operation(summary = "Get all reviews", description = "Retrieves all reviews in the system")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Reviews retrieved successfully")
    public ResponseEntity<List<com.hotel.entities.Review>> getAllReviews() {
        log.info("Getting all reviews");
        return ResponseEntity.ok(adminService.getAllReviews());
    }

    @DeleteMapping("/reviews/{id}")
    @Operation(summary = "Delete review", description = "Deletes a review from the system")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Review deleted successfully")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable Long id) {
        log.info("Deleting review ID: {}", id);
        adminService.deleteReview(id);
        return ResponseEntity.ok(new ApiResponse("Success", "Review deleted successfully"));
    }

    // Complaint Management
    @GetMapping("/complaints")
    @Operation(summary = "Get all complaints", description = "Retrieves all complaints in the system")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Complaints retrieved successfully")
    public ResponseEntity<List<com.hotel.dtos.ComplaintResponseDTO>> getAllComplaints() {
        log.info("Getting all complaints");
        return ResponseEntity.ok(adminService.getAllComplaintsDTO());
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
