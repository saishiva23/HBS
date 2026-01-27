package com.hotel.dtos;

import java.time.LocalDate;

import lombok.Data;

@Data
public class LocationDTO {
    private Long id;
    private String city;
    private String state;
    private String country;
    private String description;
    private LocalDate addedDate;
    private long hotelCount;
}
