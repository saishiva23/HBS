package com.hotel.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.entities.Hotel;
import com.hotel.service.RecentlyViewedService;

import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/api/recently-viewed")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
        "http://localhost:5175" })
@RequiredArgsConstructor
@Tag(name = "Recently Viewed", description = "User browsing history tracking endpoints")
public class RecentlyViewedController {

    private final RecentlyViewedService recentlyViewedService;

    @PostMapping("/hotel/{hotelId}")
    @Operation(summary = "Track hotel view", description = "Records that the authenticated user has viewed a specific hotel")
    @ApiResponse(responseCode = "200", description = "View recorded successfully")
    public ResponseEntity<com.hotel.dtos.ApiResponse> addRecentlyViewed(
            @Parameter(description = "Hotel ID") @PathVariable Long hotelId, Principal principal) {
        recentlyViewedService.addRecentlyViewed(hotelId, principal.getName());
        return ResponseEntity.ok(new com.hotel.dtos.ApiResponse("Success", "Hotel added to recently viewed"));
    }

    @GetMapping
    @Operation(summary = "Get recently viewed hotels", description = "Retrieves the list of hotels recently viewed by the authenticated user")
    @ApiResponse(responseCode = "200", description = "Recently viewed hotels retrieved")
    public ResponseEntity<List<Hotel>> getRecentlyViewed(Principal principal) {
        return ResponseEntity.ok(recentlyViewedService.getRecentlyViewed(principal.getName()));
    }
}