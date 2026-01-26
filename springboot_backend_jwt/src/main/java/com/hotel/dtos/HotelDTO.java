package com.hotel.dtos;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HotelDTO {
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "City is required")
    private String city;
    private String state;
    private String address;
    private Double rating;
    private Integer ratingCount;
    private String description;
    private List<String> amenities;
    private List<String> images;
    private String location;
    private String distance;
    private String ratingText;
    private Boolean petFriendly;
    private String meals;
    private Integer starRating;
}
