package com.azdev.hirgobackend.security.service;

import com.azdev.hirgobackend.models.user.User;
import com.azdev.hirgobackend.security.dto.TokenResponse;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

/**
 * Service for managing JWT tokens - creation, validation, and related operations
 */
@Service
public class TokenService {
    private static final Logger log = LogManager.getLogger(TokenService.class);

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    private final UserService userService;
    private final TokenBlacklistService blacklistService;

    // Token expiry durations
    private static final long ACCESS_TOKEN_EXPIRY = 3600L; // 1 hour
//    private static final long ACCESS_TOKEN_EXPIRY = 60L; // 1 minute
    private static final long REFRESH_TOKEN_EXPIRY = 604800L; // 7 days
    private static final long ID_TOKEN_EXPIRY = 3600L; // 1 hour

    public TokenService(JwtEncoder jwtEncoder, JwtDecoder jwtDecoder, TokenBlacklistService blacklistService, UserService userService) {
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
        this.blacklistService = blacklistService;
        this.userService = userService;
        log.info("TokenService initialized");
    }

    /**
     * Generate all tokens for a user (access, refresh, ID)
     *
     * @param user The user to generate tokens for
     * @return A TokenResponse containing all three tokens
     */
    public TokenResponse generateTokens(User user) {
        Instant now = Instant.now();

        // Get roles from user authorities
        List<String> roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        log.info("User roles: {}", roles);


        // Generate access token
        String accessToken = generateAccessToken(user, roles, now);

        // Generate refresh token
        String refreshToken = generateRefreshToken(user, accessToken, now);

        // Generate ID token
        String idToken = generateIdToken(user, now);

        log.info("Generated all tokens for user: {}", user.getUsername());
        return new TokenResponse(accessToken, refreshToken, idToken, user.getRole());
    }

    /**
     * Generate all tokens from an authentication object
     *
     * @param authentication The authentication object containing user info
     * @param user           The user entity with additional details
     * @return A TokenResponse containing all three tokens
     */
    public TokenResponse generateTokens(Authentication authentication, User user) {
        Instant now = Instant.now();

        // Get roles from authentication
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        log.info("User roles 2: {}", roles);

        // Generate access token
        String accessToken = generateAccessToken(user, roles, now);

        // Generate refresh token
        String refreshToken = generateRefreshToken(user, accessToken, now);

        // Generate ID token
        String idToken = generateIdToken(user, now);

        log.info("Generated all tokens for user 2   : {}", authentication.getName());
        return new TokenResponse(accessToken, refreshToken, idToken, user.getRole());
    }

    /**
     * Generate an access token for a user
     */
    private String generateAccessToken(User user, List<String> roles, Instant now) {
        String accessTokenJti = UUID.randomUUID().toString();
        String userId = user.getId().toString();
        JwtClaimsSet accessTokenClaims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(ACCESS_TOKEN_EXPIRY))
                .subject(userId)
                .claim("roles", roles)
                .claim("token_type", "access_token")
                .claim("jti", accessTokenJti)
                .claim("profileId", user.getProfileId())
                .build();

        String accessToken = jwtEncoder.encode(JwtEncoderParameters.from(accessTokenClaims)).getTokenValue();

        // Store the access token for this user
        blacklistService.storeUserToken(userId, accessToken);

        return accessToken;
    }

    /**
     * Generate a refresh token for a user with reference to the access token
     */
    private String generateRefreshToken(User user, String accessToken, Instant now) {
        String userId = user.getId().toString();
        JwtClaimsSet refreshTokenClaims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(REFRESH_TOKEN_EXPIRY))
                .subject(userId)
                .claim("token_type", "refresh_token")
                .claim("jti", UUID.randomUUID().toString())
                .claim("associated_access_token", accessToken) // Store reference to the access token
                .build();

        String refreshToken = jwtEncoder.encode(JwtEncoderParameters.from(refreshTokenClaims)).getTokenValue();

        // Store the refresh token for this user
        blacklistService.storeUserToken(userId, refreshToken);

        return refreshToken;
    }

    /**
     * Generate an ID token containing user-specific claims
     */
    private String generateIdToken(User user, Instant now) {
        String userId = user.getId().toString();
        JwtClaimsSet idTokenClaims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(ID_TOKEN_EXPIRY))
                .subject(userId)
                .claim("token_type", "id_token")
                .claim("email", user.getEmail())
                .claim("name", user.getUsername())
                .claim("auth_time", now.getEpochSecond())
                .claim("profileId", user.getProfileId())
                .build();

        String idToken = jwtEncoder.encode(JwtEncoderParameters.from(idTokenClaims)).getTokenValue();

        // Store the ID token for this user
        blacklistService.storeUserToken(userId, idToken);

        return idToken;
    }

    /**
     * Refresh all tokens using a valid refresh token
     *
     * @param refreshToken The refresh token to use
     * @return A TokenResponse with new tokens
     * @throws RuntimeException if the refresh token is invalid
     */
    public TokenResponse refreshTokens(String refreshToken) {
        try {
            // Validate the refresh token
            org.springframework.security.oauth2.jwt.Jwt jwt = jwtDecoder.decode(refreshToken);

            // Check if it's a refresh token
            String tokenType = jwt.getClaimAsString("token_type");
            if (!"refresh_token".equals(tokenType)) {
                throw new RuntimeException("Invalid token type");
            }

            // Blacklist the old access token if it exists
            String associatedAccessToken = jwt.getClaimAsString("associated_access_token");
            if (associatedAccessToken != null) {
                blacklistService.blacklistToken(associatedAccessToken, jwt.getExpiresAt());
                log.info("Blacklisted access token during refresh");
            }

            // Get the user's information
            String id = jwt.getSubject();
            User user = getUserByUsername(UUID.fromString(id));

            // Generate new tokens
            TokenResponse newTokens = generateTokens(user);

            // Blacklist the old refresh token
            blacklistService.blacklistToken(refreshToken, jwt.getExpiresAt());
            log.info("Blacklisted old refresh token during refresh for user: {}", id);

            return newTokens;
        } catch (Exception e) {
            log.error("Error refreshing tokens", e);
            throw new RuntimeException("Invalid refresh token: " + e.getMessage());
        }
    }

    /**
     * Blacklist specific token
     */
    public void blacklistToken(String token) {
        try {
            org.springframework.security.oauth2.jwt.Jwt jwt = jwtDecoder.decode(token);
            blacklistService.blacklistToken(token, jwt.getExpiresAt());
            log.info("Token blacklisted: {}", jwt.getClaimAsString("token_type"));
        } catch (Exception e) {
            log.warn("Failed to blacklist token: {}", e.getMessage());
            throw new RuntimeException("Invalid token for blacklisting");
        }
    }

    /**
     * Blacklist all tokens for a user
     */
    public void blacklistAllUserTokens(String username) {
        blacklistService.blacklistAllUserTokens(username);
        log.info("Blacklisted all tokens for user: {}", username);
    }

    /**
     * Extract username from a token
     */
    public String getUsernameFromToken(String token) {
        try {
            org.springframework.security.oauth2.jwt.Jwt jwt = jwtDecoder.decode(token);
            return jwt.getSubject();
        } catch (Exception e) {
            log.error("Error extracting username from token", e);
            throw new RuntimeException("Invalid token");
        }
    }

    /**
     * Get user by username - placeholder to be implemented by concrete class
     */
    protected User getUserByUsername(UUID userId) {
        return userService.findById(userId);
    }
} 