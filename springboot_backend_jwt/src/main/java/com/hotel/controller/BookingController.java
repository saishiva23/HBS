package com.hotel.controller;

import java.security.Principal;
import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dtos.BookingDTO;
import com.hotel.dtos.BookingResponseDTO;
import com.hotel.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
        "http://localhost:5175" })
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Hotel booking creation, management, and invoice operations")
public class BookingController {

    private final BookingService bookingService;
    private final com.hotel.service.InvoiceService invoiceService;
    private final com.hotel.repository.BookingRepository bookingRepository;

    @PostMapping
    @Operation(summary = "Create booking", description = "Creates a new hotel booking for the authenticated user. Returns booking confirmation with details.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Booking created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid booking data"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<BookingResponseDTO> createBooking(@RequestBody @Valid BookingDTO bookingDTO,
            Principal principal) {
        return ResponseEntity.ok(bookingService.createBooking(bookingDTO, principal.getName()));
    }

    @GetMapping("/my-bookings")
    @Operation(summary = "Get user bookings", description = "Retrieves all bookings made by the currently authenticated user")
    @ApiResponse(responseCode = "200", description = "Bookings retrieved successfully")
    public ResponseEntity<List<BookingResponseDTO>> getUserBookings(Principal principal) {
        return ResponseEntity.ok(bookingService.getUserBookings(principal.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get all bookings (Admin)", description = "Retrieves all bookings in the system. Admin access required.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "All bookings retrieved"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update booking", description = "Updates an existing booking. User must own the booking.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Booking updated successfully"),
            @ApiResponse(responseCode = "403", description = "Not authorized to update this booking"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    public ResponseEntity<BookingResponseDTO> updateBooking(
            @Parameter(description = "Booking ID") @PathVariable Long id,
            @RequestBody @Valid BookingDTO bookingDTO, Principal principal) {
        return ResponseEntity.ok(bookingService.updateBooking(id, bookingDTO, principal.getName()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel booking", description = "Cancels a booking. User must own the booking to cancel it.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Booking cancelled successfully"),
            @ApiResponse(responseCode = "403", description = "Not authorized to cancel this booking"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    public ResponseEntity<?> cancelBooking(
            @Parameter(description = "Booking ID") @PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, principal.getName()));
    }

    @PostMapping("/{id}/resend-invoice")
    @Operation(summary = "Resend booking invoice", description = "Resends the invoice email for a specific booking to the user's email address")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Invoice sent successfully"),
            @ApiResponse(responseCode = "403", description = "Not authorized to access this booking"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    public ResponseEntity<?> resendInvoice(
            @Parameter(description = "Booking ID") @PathVariable Long id, Principal principal) {
        com.hotel.entities.Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new com.hotel.custom_exceptions.ResourceNotFoundException(
                        "Booking not found with ID: " + id));

        // Verify user owns this booking
        if (!booking.getUser().getEmail().equals(principal.getName())) {
            return ResponseEntity.status(403).body("Not authorized to access this booking");
        }

        invoiceService.generateAndSendInvoice(booking);
        return ResponseEntity.ok(new com.hotel.dtos.ApiResponse("Success", "Invoice sent to your email"));
    }
}
