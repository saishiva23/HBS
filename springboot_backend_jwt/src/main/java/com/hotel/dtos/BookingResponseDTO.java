package com.hotel.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingResponseDTO {
    private Long id;
    private String bookingReference;
    private Long hotelId;
    private String hotelName;
    private String hotelCity;
    private String hotelState;
    private String roomTypeName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal totalPrice;
    
    // Frozen pricing fields
    private BigDecimal pricePerNight;
    private Integer nights;
    private BigDecimal baseAmount;
    private String status;
    private Integer adults;
    private Integer children;
    private Integer rooms;
    private String hotelImage;
    private LocalDate bookingDate;

    // Guest details
    private String guestFirstName;
    private String guestLastName;
    private String guestEmail;
    private String guestPhone;

    // Payment details
    private String paymentStatus;
    private String paymentMethod;
    private String transactionId;

    // Registered User details
    private String userEmail;
    private String userName;
    
    // Room assignment details
    private List<String> assignedRoomNumbers;  // e.g., ["101", "102"]
    private String roomNumbersDisplay;  // e.g., "101, 102"
}
