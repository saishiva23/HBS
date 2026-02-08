package com.hotel.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hotel.entities.PasswordResetToken;
import com.hotel.entities.User;

/**
 * Repository for managing password reset tokens.
 */
@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    /**
     * Find a token by its token string
     */
    Optional<PasswordResetToken> findByToken(String token);

    /**
     * Delete all tokens that expired before the given date
     * Used for cleanup of old tokens
     */
    void deleteByExpiryDateBefore(LocalDateTime date);

    /**
     * Delete all tokens for a specific user
     * Used when creating a new reset token to invalidate old ones
     */
    void deleteByUser(User user);
}
