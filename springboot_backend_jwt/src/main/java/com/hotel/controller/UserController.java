package com.hotel.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dtos.AuthRequest;
import com.hotel.dtos.AuthResp;
import com.hotel.dtos.UserDTO;
import com.hotel.dtos.UserRegDTO;
import com.hotel.entities.User;
import com.hotel.repository.UserRepository;
import com.hotel.service.UserService;
import com.hotel.custom_exceptions.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.modelmapper.ModelMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
        "http://localhost:5175" })
@RequiredArgsConstructor
@Validated
@Slf4j
@Tag(name = "Users", description = "User authentication, registration, and profile management endpoints")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieves a list of all registered users in the system. Returns 204 No Content if no users exist.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "204", description = "No users found")
    })
    public ResponseEntity<?> getAllUsers() {
        log.info("Getting all users");
        List<UserDTO> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get user by ID", description = "Retrieves detailed information about a specific user by their ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User found"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<?> getUserById(
            @Parameter(description = "User ID", example = "1") @PathVariable @Min(1) @Max(100) Long userId) {
        log.info("Getting user details for ID: {}", userId);
        return ResponseEntity.ok(userService.getUserDetails(userId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user details", description = "Updates user information for a specific user ID. Requires authentication.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User updated successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<?> updateUser(
            @Parameter(description = "User ID") @PathVariable Long id,
            @RequestBody @Valid User user) {
        log.info("Updating user with ID: {}", id);
        return ResponseEntity.ok(userService.updateDetails(id, user));
    }

    @PostMapping("/signin")
    @Operation(summary = "User login", description = "Authenticates a user with email and password. Returns JWT token on successful authentication. This token should be used in the Authorization header for protected endpoints.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful, JWT token returned"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<?> signIn(@RequestBody @Valid AuthRequest request) {
        log.info("User sign in attempt for email: {}", request.getEmail());

        try {
            AuthResp response = userService.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Authentication failed for user: {}", request.getEmail(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResp(null, "Invalid email or password", null, null));
        }
    }

    @PostMapping("/signup")
    @Operation(summary = "User registration", description = "Registers a new user account. Returns authentication response with JWT token.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or email already exists")
    })
    public ResponseEntity<?> signUp(@RequestBody @Valid UserRegDTO dto) {
        log.info("User registration attempt for email: {}", dto.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.registerUser(dto));
    }

    @PatchMapping("/reset-password")
    @Operation(description = "Reset user password (Admin/Dev tool)")
    public ResponseEntity<?> resetPassword(@org.springframework.web.bind.annotation.RequestParam String email,
            @org.springframework.web.bind.annotation.RequestParam String password) {
        log.info("Resetting password for email: {}", email);
        userService.resetPassword(email, password);
        return ResponseEntity.ok("Password reset successfully");
    }

    @PatchMapping("/fix-passwords")
    @Operation(description = "Fix existing user passwords to match plain text")
    public ResponseEntity<?> fixPasswords() {
        log.info("Fixing existing user passwords");
        try {
            // Reset specific user password to match what you're trying to login with
            userService.resetPassword("rami@example.com", "1234");
            return ResponseEntity.ok("Password fixed for rami@example.com");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/debug-password")
    @Operation(description = "Debug password for specific user")
    public ResponseEntity<?> debugPassword(@org.springframework.web.bind.annotation.RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // Test common passwords against the hash
            String[] testPasswords = { "1234", "password", "123456", "admin", "user", "test", "rami", "12345" };

            for (String testPwd : testPasswords) {
                boolean matches = passwordEncoder.matches(testPwd, user.getPassword());
                if (matches) {
                    return ResponseEntity.ok("Password for " + email + " is: " + testPwd);
                }
            }

            return ResponseEntity.ok("Password not found in common list. Hash: " + user.getPassword());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PatchMapping("/pwd-encryption")
    @Operation(description = "Encrypt all user passwords")
    public ResponseEntity<?> encryptPasswords() {
        log.info("Encrypting user passwords");
        return ResponseEntity.ok(userService.encryptPasswords());
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile", description = "Retrieves the profile information of the currently authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> getCurrentUserProfile(Principal principal) {
        log.info("Getting current user profile for: {}", principal.getName());
        try {
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            return ResponseEntity.ok(modelMapper.map(user, UserDTO.class));
        } catch (Exception e) {
            log.error("Error getting user profile", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile", description = "Updates the profile information of the currently authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> updateCurrentUserProfile(@RequestBody @Valid User user, Principal principal) {
        log.info("Updating current user profile for: {}", principal.getName());
        try {
            User currentUser = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            log.info("DEBUG - Principal email: {}, Current user ID: {}, Incoming email: {}",
                    principal.getName(), currentUser.getId(), user.getEmail());

            return ResponseEntity.ok(userService.updateDetails(currentUser.getId(), user));
        } catch (Exception e) {
            log.error("Error updating user profile", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PatchMapping("/change-password")
    @Operation(summary = "Change user password", description = "Changes the password for the currently authenticated user. Requires current password verification.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password changed successfully"),
            @ApiResponse(responseCode = "400", description = "Current password is incorrect"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<?> changePassword(
            @Parameter(description = "Current password") @org.springframework.web.bind.annotation.RequestParam String currentPassword,
            @Parameter(description = "New password") @org.springframework.web.bind.annotation.RequestParam String newPassword,
            Principal principal) {
        log.info("Changing password for user: {}", principal.getName());
        try {
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body("Current password is incorrect");
            }

            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            log.error("Error changing password", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ==================== Password Reset Endpoints ====================

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset", description = "Sends a password reset email to the user if the email exists. Always returns success for security reasons.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reset email sent if account exists"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<?> forgotPassword(@org.springframework.web.bind.annotation.RequestParam String email) {
        log.info("Password reset requested for email: {}", email);
        try {
            userService.requestPasswordReset(email);
            return ResponseEntity.ok(new com.hotel.dtos.ApiResponse("Success",
                    "If an account with that email exists, a password reset link has been sent"));
        } catch (Exception e) {
            log.error("Error processing password reset request", e);
            // Still return success message for security (don't reveal if email exists)
            return ResponseEntity.ok(new com.hotel.dtos.ApiResponse("Success",
                    "If an account with that email exists, a password reset link has been sent"));
        }
    }

    @GetMapping("/validate-reset-token")
    @Operation(summary = "Validate password reset token", description = "Checks if a password reset token is valid and not expired")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token validation result"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<?> validateResetToken(@org.springframework.web.bind.annotation.RequestParam String token) {
        log.info("Validating reset token");
        try {
            boolean isValid = userService.validateResetToken(token);
            if (isValid) {
                return ResponseEntity.ok(new com.hotel.dtos.ApiResponse("Success", "Token is valid"));
            } else {
                return ResponseEntity.badRequest()
                        .body(new com.hotel.dtos.ApiResponse("Error", "Invalid or expired token"));
            }
        } catch (Exception e) {
            log.error("Error validating reset token", e);
            return ResponseEntity.badRequest()
                    .body(new com.hotel.dtos.ApiResponse("Error", "Invalid or expired token"));
        }
    }

    @PostMapping("/reset-password-with-token")
    @Operation(summary = "Reset password with token", description = "Resets user password using a valid reset token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password reset successful"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token")
    })
    public ResponseEntity<?> resetPasswordWithToken(
            @org.springframework.web.bind.annotation.RequestParam String token,
            @org.springframework.web.bind.annotation.RequestParam String newPassword) {
        log.info("Resetting password with token");
        try {
            userService.resetPasswordWithToken(token, newPassword);
            return ResponseEntity.ok(new com.hotel.dtos.ApiResponse("Success", "Password reset successful"));
        } catch (Exception e) {
            log.error("Error resetting password with token", e);
            return ResponseEntity.badRequest().body(new com.hotel.dtos.ApiResponse("Error", e.getMessage()));
        }
    }
}
