package com.hotel.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomStatsDTO {
    private Long totalRooms;
    private Long availableRooms;
    private Long occupiedRooms;
    private Long maintenanceRooms;
}
