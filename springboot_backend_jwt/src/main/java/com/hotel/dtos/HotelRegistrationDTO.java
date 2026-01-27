package com.hotel.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HotelRegistrationDTO {

    @Valid
    @NotNull
    private UserRegDTO user;

    @Valid
    @NotNull
    private HotelDTO hotel;
}
