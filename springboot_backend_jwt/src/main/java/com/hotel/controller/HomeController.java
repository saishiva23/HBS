package com.hotel.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@Tag(name = "Public", description = "Public endpoints including API health check")
public class HomeController {

    @GetMapping("/")
    @Operation(summary = "API health check", description = "Returns a welcome message indicating the API is running")
    @ApiResponse(responseCode = "200", description = "API is operational")
    public String home() {
        return "Welcome to Hotel Booking API! Backend is running successfully.";
    }
}
