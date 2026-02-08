package com.hotel.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.hotel.custom_exceptions.AuthenticationFailedException;
import com.hotel.custom_exceptions.InvalidInputException;
import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.AuthRequest;
import com.hotel.dtos.AuthResp;
import com.hotel.dtos.UserDTO;
import com.hotel.dtos.UserRegDTO;
import com.hotel.entities.AccountStatus;
import com.hotel.entities.PasswordResetToken;
import com.hotel.entities.User;
import com.hotel.entities.UserRole;
import com.hotel.repository.UserRepository;
import com.hotel.repository.PasswordResetTokenRepository;
import com.hotel.security.JwtUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final RestTemplate restTemplate;

    @Value("${invoice.service.url:http://localhost:5000}")
    private String invoiceServiceUrl;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

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

    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        log.info("Password reset requested for email: {}", email);

        // Find user - don't reveal if email doesn't exist (security best practice)
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            log.warn("Password reset requested for non-existent email: {}", email);
            // Don't reveal that email doesn't exist - just return silently
            return;
        }

        try {
            // Delete any existing tokens for this user
            passwordResetTokenRepository.deleteByUser(user);

            // Generate new token
            String token = UUID.randomUUID().toString();
            LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);

            PasswordResetToken resetToken = new PasswordResetToken(token, user, expiryDate);
            passwordResetTokenRepository.save(resetToken);

            // Send email with reset link
            sendPasswordResetEmail(user.getEmail(), user.getFirstName(), token);

            log.info("Password reset token created and email sent for: {}", email);
        } catch (Exception e) {
            log.error("Failed to process password reset request for: {}", email, e);
            // Don't throw exception to user - just log it
        }
    }

    @Override
    public boolean validateResetToken(String token) {
        log.info("Validating reset token");

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token).orElse(null);

        if (resetToken == null) {
            log.warn("Token not found");
            return false;
        }

        if (resetToken.isUsed()) {
            log.warn("Token already used");
            return false;
        }

        if (resetToken.isExpired()) {
            log.warn("Token expired");
            return false;
        }

        return true;
    }

    @Override
    @Transactional
    public void resetPasswordWithToken(String token, String newPassword) {
        log.info("Resetting password with token");

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidInputException("Invalid or expired reset token"));

        if (resetToken.isUsed()) {
            throw new InvalidInputException("This reset link has already been used");
        }

        if (resetToken.isExpired()) {
            throw new InvalidInputException("This reset link has expired");
        }

        // Update password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        log.info("Password reset successful for user: {}", user.getEmail());
    }

    /**
     * Send password reset email using Invoice Service email functionality
     */
    private void sendPasswordResetEmail(String toEmail, String userName, String token) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + token;

            // Prepare email request for Invoice Service
            Map<String, Object> emailRequest = new HashMap<>();
            emailRequest.put("to", toEmail);
            emailRequest.put("subject", "Password Reset Request - Hotel Booking System");
            emailRequest.put("htmlBody", buildPasswordResetEmailHtml(userName, resetLink));

            // Call Invoice Service email endpoint
            String emailUrl = invoiceServiceUrl + "/api/email/send";
            restTemplate.postForObject(emailUrl, emailRequest, String.class);

            log.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send password reset email");
        }
    }

    /**
     * Build HTML email body for password reset
     */
    private String buildPasswordResetEmailHtml(String userName, String resetLink) {
        return String.format(
                """
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #2563eb;">Password Reset Request</h2>
                            <p>Dear %s,</p>
                            <p>We received a request to reset your password for your Hotel Booking System account.</p>
                            <p>Click the button below to reset your password:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="%s" style="background-color: #eab308; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Reset Password</a>
                            </div>
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; color: #666;">%s</p>
                            <p><strong>This link will expire in 15 minutes.</strong></p>
                            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
                            <br>
                            <p>Best Regards,<br>Hotel Booking System Team</p>
                            <hr style="border: 1px solid #eee; margin-top: 30px;">
                            <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
                        </div>
                        """,
                userName, resetLink, resetLink);
    }
}
