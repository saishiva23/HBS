package com.hotel.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.hotel.validation.ValidBookingDates;

@Getter
@Setter
@ToString
@ValidBookingDates
public class BookingDTO {

    @NotNull(message = "Hotel ID is required")
    private Long hotelId;

    @NotNull(message = "Room Type ID is required")
    private Long roomTypeId;

    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date must be today or in the future")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    @FutureOrPresent(message = "Check-out date must be today or in the future")
    private LocalDate checkOutDate;

    @NotNull(message = "Number of adults is required")
    @jakarta.validation.constraints.Min(value = 1, message = "At least 1 adult is required")
    @jakarta.validation.constraints.Max(value = 10, message = "Maximum 10 adults allowed")
    private Integer adults = 1;
    
    @NotNull(message = "Number of children is required")
    @jakarta.validation.constraints.Min(value = 0, message = "Children cannot be negative")
    @jakarta.validation.constraints.Max(value = 10, message = "Maximum 10 children allowed")
    private Integer children = 0;
    
    @NotNull(message = "Number of rooms is required")
    @jakarta.validation.constraints.Min(value = 1, message = "At least 1 room is required")
    @jakarta.validation.constraints.Max(value = 10, message = "Maximum 10 rooms allowed")
    private Integer rooms = 1;
    private BigDecimal totalPrice;
    private BigDecimal pricePerNight; // Frozen price from checkout

    // Guest details for booking
    private String guestFirstName;
    private String guestLastName;
    private String guestEmail;
    private String guestPhone;

    // Payment details
    private String paymentMethod; // CREDIT_CARD, UPI, NET_BANKING
    private String paymentStatus;
    private String transactionId;
}
