package com.hotel.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponseDTO {

    private Long id;
    private String roomNumber;
    private Long roomTypeId;
    private String roomTypeName;
    private Boolean isActive;
    private String status;

    // Room count information
    private Integer roomTypeLimit; // RoomType.totalRooms
    private Integer roomTypeUsed; // Actual count of rooms
}
