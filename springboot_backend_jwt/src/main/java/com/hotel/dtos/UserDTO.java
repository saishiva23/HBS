package com.hotel.dtos;

import java.time.LocalDate;

import com.hotel.entities.UserRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private LocalDate dob;
    private UserRole userRole;
    private int regAmount;
    private String accountStatus;
    private LocalDate createdAt;

    public UserDTO(String firstName, String lastName, LocalDate dob) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
    }

}
