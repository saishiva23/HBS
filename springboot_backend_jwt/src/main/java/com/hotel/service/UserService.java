package com.hotel.service;

import java.util.List;

import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.AuthRequest;
import com.hotel.dtos.AuthResp;
import com.hotel.dtos.UserDTO;
import com.hotel.dtos.UserRegDTO;
import com.hotel.entities.User;

public interface UserService {
    // get all users
    List<UserDTO> getAllUsers();

    UserDTO registerUser(UserRegDTO dto);

    String addUser(User user);

    ApiResponse deleteUserDetails(Long userId);

    User getUserDetails(Long userId);

    ApiResponse updateDetails(Long id, User user);

    AuthResp authenticate(AuthRequest request);

    ApiResponse encryptPasswords();

    void resetPassword(String email, String newPassword);

    // Password reset with token methods
    void requestPasswordReset(String email);

    boolean validateResetToken(String token);

    void resetPasswordWithToken(String token, String newPassword);
}