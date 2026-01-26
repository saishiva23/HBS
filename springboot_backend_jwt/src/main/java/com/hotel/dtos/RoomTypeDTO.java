package com.hotel.dtos;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomTypeDTO {
    private String name;
    private String description;
    @NotNull
    private BigDecimal pricePerNight;
    private Integer capacity;
    private List<String> amenities;
    private List<String> images;
}
