package com.hotel.dtos;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintResponseDTO {
    private Long id;
    private Long hotelId;
    private String hotelName;
    private Long bookingId;
    private String bookingReference;
    private String guestName;
    private String guestEmail;
    private String subject;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private String resolution;
}
