package com.hotel.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// JWT , message
public class AuthResp {
    private String jwt;
    private String message;
    private String role;
    private String name;

}
