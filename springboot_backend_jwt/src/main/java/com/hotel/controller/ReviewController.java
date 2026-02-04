package com.hotel.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dtos.ReviewDTO;
import com.hotel.entities.Review;
import com.hotel.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
        "http://localhost:5175" })
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Hotel review and rating management endpoints")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Create review", description = "Submit a review for a hotel. User must be authenticated.")
    @ApiResponse(responseCode = "200", description = "Review created successfully")
    public ResponseEntity<Review> createReview(@RequestBody @Valid ReviewDTO reviewDTO, Principal principal) {
        return ResponseEntity.ok(reviewService.createReview(reviewDTO, principal.getName()));
    }

    @GetMapping("/hotel/{hotelId}")
    @Operation(summary = "Get hotel reviews", description = "Retrieves all reviews for a specific hotel")
    @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully")
    public ResponseEntity<List<Review>> getHotelReviews(
            @Parameter(description = "Hotel ID") @PathVariable Long hotelId) {
        return ResponseEntity.ok(reviewService.getHotelReviews(hotelId));
    }

    @GetMapping("/my-reviews")
    @Operation(summary = "Get user reviews", description = "Retrieves all reviews submitted by the authenticated user")
    @ApiResponse(responseCode = "200", description = "User reviews retrieved successfully")
    public ResponseEntity<List<Review>> getUserReviews(Principal principal) {
        return ResponseEntity.ok(reviewService.getUserReviews(principal.getName()));
    }
}