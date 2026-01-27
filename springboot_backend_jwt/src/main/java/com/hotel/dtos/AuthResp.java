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

    public AuthResp(String jwt, String message) {
        this.jwt = jwt;
        this.message = message;
        this.role = "user"; // Default role
        this.name = "User"; // Default name
    }
}
