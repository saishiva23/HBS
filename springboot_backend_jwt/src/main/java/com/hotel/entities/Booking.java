package com.hotel.entities;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.hotel.entities.RoomType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Booking extends BaseEntity {

    @Column(name = "booking_reference", unique = true)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    @ToString.Exclude
    private Hotel hotel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    @ToString.Exclude
    private RoomType roomType;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;
    
    // Frozen pricing fields - preserve checkout prices
    @Column(name = "price_per_night", nullable = false)
    private BigDecimal pricePerNight;
    
    @Column(name = "nights")
    private Integer nights;
    
    @Column(name = "base_amount")
    private BigDecimal baseAmount; // pricePerNight * nights * rooms

    @Column(nullable = false)
    private String status; // confirmed, cancelled, completed

    private Integer adults = 1;
    private Integer children = 0;
    private Integer rooms = 1;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    // Guest details
    @Column(name = "guest_first_name")
    private String guestFirstName;

    @Column(name = "guest_last_name")
    private String guestLastName;

    @Column(name = "guest_email")
    private String guestEmail;

    @Column(name = "guest_phone")
    private String guestPhone;

    // Payment fields
    @Column(name = "payment_status")
    private String paymentStatus; // PENDING, COMPLETED, FAILED

    @Column(name = "payment_method")
    private String paymentMethod; // CREDIT_CARD, UPI, NET_BANKING

    @Column(name = "transaction_id")
    private String transactionId;
}
