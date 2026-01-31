package com.hotel.entities;

import java.util.List;

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
@Table(name = "hotels")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Hotel extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String city;

    private String state;

    @Column(nullable = false)
    private String address;

    @Column(name = "star_rating")
    private Integer starRating;

    @Column(nullable = false)
    private Double rating = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    private Boolean wifi = false;
    private Boolean parking = false;
    private Boolean gym = false;
    private Boolean ac = false;
    private Boolean restaurant = false;
    @Column(name = "room_service")
    private Boolean roomService = false;

    @Column(columnDefinition = "JSON")
    private String images;

    private String location;

    @Column(name = "distance_to_center")
    private String distance;

    @Column(name = "rating_text")
    private String ratingText;

    // Approval fields
    private String status; // PENDING, APPROVED, REJECTED

    @Column(name = "price_range")
    private String priceRange;

    // Owner relationship
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    @ToString.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User owner; // Links to ROLE_HOTEL_MANAGER
}