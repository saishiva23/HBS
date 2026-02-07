package com.hotel.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.custom_exceptions.AuthenticationFailedException;
import com.hotel.custom_exceptions.InvalidInputException;
import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.AuthRequest;
import com.hotel.dtos.AuthResp;
import com.hotel.dtos.UserDTO;
import com.hotel.dtos.UserRegDTO;
import com.hotel.entities.AccountStatus;
import com.hotel.entities.User;
import com.hotel.entities.UserRole;
import com.hotel.repository.UserRepository;
import com.hotel.security.JwtUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public List<UserDTO> getAllUsers() {
        log.debug("Getting all users");
        return userRepository.findAll()
                .stream()
                .map(entity -> modelMapper.map(entity, UserDTO.class))
                .toList();
    }

    @Override
    public UserDTO registerUser(UserRegDTO dto) {
        log.info("Registering new user with email: {}", dto.getEmail());

        try {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new InvalidInputException("User already exists with this email");
            }

            User user = modelMapper.map(dto, User.class);
            user.setUserRole(UserRole.ROLE_CUSTOMER);
            user.setAccountStatus(AccountStatus.ACTIVE); // Set default account status

            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);

            User savedUser = userRepository.save(user);
            return modelMapper.map(savedUser, UserDTO.class);
        } catch (Exception e) {
            log.error("Error registering user: {}", dto.getEmail(), e);
            throw e;
        }
    }

    @Override
    public String addUser(User user) {
        log.info("Adding new user: {}", user.getEmail());
        if (userRepository.existsByEmailOrPhone(user.getEmail(), user.getPhone())) {
            throw new InvalidInputException("User already exists with this email or phone");
        }
        User savedUser = userRepository.save(user);
        return "New User added with ID=" + savedUser.getId();
    }

    @Override
    public ApiResponse deleteUserDetails(Long userId) {
        log.info("Deleting user with ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
        return new ApiResponse("Success", "User deleted successfully");
    }

    @Override
    public User getUserDetails(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    @Transactional
    @Override
    public ApiResponse updateDetails(Long id, User user) {
        log.info("Updating user details for ID: {}", id);

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        // Update fields
        if (user.getFirstName() != null)
            existingUser.setFirstName(user.getFirstName());
        if (user.getLastName() != null)
            existingUser.setLastName(user.getLastName());
        if (user.getPhone() != null)
            existingUser.setPhone(user.getPhone());
        if (user.getDob() != null)
            existingUser.setDob(user.getDob());
        if (user.getRegAmount() != null)
            existingUser.setRegAmount(user.getRegAmount());
        if (user.getAddress() != null)
            existingUser.setAddress(user.getAddress());

        // Skip email updates in profile updates to avoid conflicts
        // Email changes should be handled through a separate endpoint

        userRepository.save(existingUser);
        log.info("User details updated successfully for ID: {}", id);
        return new ApiResponse("Success", "User updated successfully");
    }

    @Override
    public AuthResp authenticate(AuthRequest request) {
        String receivedEmail = request.getEmail();
        log.info("Authenticating user with email: '{}' (length: {}, contains @: {})",
                receivedEmail,
                receivedEmail != null ? receivedEmail.length() : 0,
                receivedEmail != null && receivedEmail.contains("@"));

        try {
            User user = userRepository.findByEmail(receivedEmail)
                    .orElseThrow(() -> new AuthenticationFailedException(
                            "User by this email doesn't exist: " + receivedEmail));

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new AuthenticationFailedException("Invalid email or password");
            }

            // Check if account is suspended
            if (AccountStatus.SUSPENDED.equals(user.getAccountStatus())) {
                throw new AuthenticationFailedException("Account suspended: Contact admin");
            }

            String jwtToken = jwtUtils.generateToken(user.getEmail(), user.getUserRole().name(), user.getId());

            // --- Map role to frontend friendly format ---
            String role = "user";
            if (user.getUserRole() == UserRole.ROLE_ADMIN)
                role = "admin";
            else if (user.getUserRole() == UserRole.ROLE_HOTEL_MANAGER)
                role = "owner";

            String name = user.getFirstName();
            if (user.getLastName() != null)
                name += " " + user.getLastName();

            return new AuthResp(jwtToken, "Login successful", role, name);
            // ---------------------------------------------

        } catch (Exception e) {
            log.error("Authentication failed for user: '{}', Message: {}", receivedEmail, e.getMessage());
            throw new AuthenticationFailedException(e.getMessage());
        }
    }

    @Override
    public ApiResponse encryptPasswords() {
        List<User> users = userRepository.findAll();
        users.forEach(user -> user.setPassword(passwordEncoder.encode(user.getPassword())));
        return new ApiResponse("Success", "All passwords encrypted successfully");
    }

    @Override
    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}