package com.hotel.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoomDTO {

    private String roomNumber;
    private Long roomTypeId;
    private Boolean isActive = true;
    private String status = "AVAILABLE";
}
