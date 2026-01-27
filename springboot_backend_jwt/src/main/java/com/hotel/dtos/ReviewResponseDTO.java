package com.hotel.dtos;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewResponseDTO {
    private Long id;
    private String guestName;
    private String guestEmail;
    private Integer rating;
    private String title;
    private String comment;
    private LocalDateTime createdAt;
}
