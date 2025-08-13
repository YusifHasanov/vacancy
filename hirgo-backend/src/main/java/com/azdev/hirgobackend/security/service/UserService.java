package com.azdev.hirgobackend.security.service;

import com.azdev.hirgobackend.enums.Role;
import com.azdev.hirgobackend.models.user.User;
import com.azdev.hirgobackend.repositories.UserRepository;
import java.util.Optional;
import java.util.UUID;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service for user management operations
 */
@Service
public class UserService {

    private static final Logger log = LogManager.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        log.info("UserService initialized");
    }

    /**
     * Find a user by email
     *
     * @param email The email to search for
     * @return Optional containing the user if found
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findById(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> {
            log.warn("User not found with email: {}", id);
            return new RuntimeException("User not found with email: " + id);
        });
    }

    /**
     * Get user by email, throwing an exception if not found
     *
     * @param email The email to search for
     * @return The user
     * @throws RuntimeException if user not found
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("User not found with email: {}", email);
                    return new RuntimeException("User not found with email: " + email);
                });
    }

    /**
     * Check if a user with the given email exists
     *
     * @param email The email to check
     * @return true if a user with this email exists
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Create a new user
     *
     * @param email       User's email
     * @param rawPassword User's password (will be encoded)
     * @param role        User's role
     * @param profileId   ID of the user's profile (company or applicant)
     * @return The created user
     */
    public User createUser(String email, String rawPassword, Role role, Long profileId) {
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .role(role)
                .profileId(profileId)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .enabled(true)
                .build();

        user = userRepository.save(user);
        log.info("Created new user with email: {} and role: {}", email, role);
        return user;
    }
} 