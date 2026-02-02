package com.hotel.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityDTO {
    private Boolean available;
    private Long availableRoomsCount;
    private Long totalRoomsCount;
    private String message;

    public AvailabilityDTO(Boolean available, Long availableRoomsCount, Long totalRoomsCount) {
        this.available = available;
        this.availableRoomsCount = availableRoomsCount;
        this.totalRoomsCount = totalRoomsCount;
        this.message = available
                ? availableRoomsCount + " out of " + totalRoomsCount + " rooms available"
                : "Only " + availableRoomsCount + " out of " + totalRoomsCount + " rooms available";
    }
}
