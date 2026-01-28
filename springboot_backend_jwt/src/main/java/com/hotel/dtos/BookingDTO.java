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

    private Integer adults = 1;
    private Integer children = 0;
    private Integer rooms = 1;
    private BigDecimal totalPrice;

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
