package com.azdev.hirgobackend.security.service;

import com.azdev.hirgobackend.models.user.User;
import com.azdev.hirgobackend.security.dto.IntrospectionResponse;
import com.azdev.hirgobackend.security.dto.LoginRequest;
import com.azdev.hirgobackend.security.dto.TokenResponse;
import com.azdev.hirgobackend.security.exception.SecurityExceptionHandler.TokenValidationException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

/**
 * Service handling authentication logic including login, token refresh, and logout
 */
@Service
@Log4j2
public class AuthService {
    
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtDecoder jwtDecoder;
    private final TokenBlacklistService blacklistService;
    
    public AuthService(TokenService tokenService,
                       AuthenticationManager authenticationManager,
                       UserService userService, JwtDecoder jwtDecoder, TokenBlacklistService blacklistService) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtDecoder = jwtDecoder;
        this.blacklistService = blacklistService;
        log.info("AuthService initialized");
    }
    
    /**
     * Authenticate user and generate authentication tokens
     * 
     * @param loginRequest User credentials
     * @return Tokens for the authenticated user
     */
    public TokenResponse login(LoginRequest loginRequest) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Get user details
            User user = userService.getUserByEmail(authentication.getName());
            
            // Generate tokens
            TokenResponse tokenResponse = tokenService.generateTokens(authentication, user);
            
            log.info("User logged in successfully: {}", authentication.getName());
            return tokenResponse;
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            throw new RuntimeException("Authentication failed", e);
        }
    }
    
    /**
     * Generate new tokens using a valid refresh token
     * 
     * @param refreshToken The refresh token
     * @return New set of tokens
     */
    public TokenResponse refreshToken(String refreshToken) {
        try {
            TokenResponse tokenResponse = tokenService.refreshTokens(refreshToken);
            log.info("Tokens refreshed successfully");
            return tokenResponse;
        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            throw new TokenValidationException("Token refresh failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Process logout for a user by invalidating their tokens
     * 
     * @param token Access token to invalidate (optional)
     * @param refreshToken Refresh token to invalidate (optional)
     * @param request HTTP request to extract authorization header
     * @return true if tokens were successfully processed, false otherwise
     */
    public boolean logout(String token, String refreshToken, HttpServletRequest request) {
        log.info("Processing logout request");
        boolean tokenProcessed = false;
        String username = null;
        
        // Process token parameter if provided
        if (token != null && !token.isBlank()) {
            try {
                username = tokenService.getUsernameFromToken(token);
                tokenService.blacklistToken(token);
                tokenProcessed = true;
            } catch (Exception e) {
                log.warn("Failed to process token parameter: {}", e.getMessage());
            }
        }
        
        // Process Authorization header if present
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String bearerToken = authHeader.substring(7);
                username = tokenService.getUsernameFromToken(bearerToken);
                tokenService.blacklistToken(bearerToken);
                tokenProcessed = true;
            } catch (Exception e) {
                log.warn("Failed to process bearer token: {}", e.getMessage());
            }
        }
        
        // Process refresh token if provided
        if (refreshToken != null && !refreshToken.isBlank()) {
            try {
                String refreshUsername = tokenService.getUsernameFromToken(refreshToken);
                if (username == null) {
                    username = refreshUsername;
                }
                tokenService.blacklistToken(refreshToken);
                tokenProcessed = true;
            } catch (Exception e) {
                log.warn("Failed to process refresh token: {}", e.getMessage());
            }
        }
        
        // Blacklist all tokens for the user if username was determined
        if (username != null) {
            tokenService.blacklistAllUserTokens(username);
            log.info("All tokens blacklisted for user: {}", username);
            tokenProcessed = true;
        }
        
        return tokenProcessed;
    }

        /**
     * Introspects the access token to provide its details
     * 
     * @param token The access token to introspect
     * @return IntrospectionResponse with token details
     */
    public IntrospectionResponse introspectToken(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            String username = jwt.getSubject();
            Instant expirationTime = jwt.getExpiresAt();
            long expiresAt = expirationTime != null ? expirationTime.toEpochMilli() : 0;
            boolean isActive = !blacklistService.isBlacklisted(token) && Instant.now().toEpochMilli() < expiresAt;

            return new IntrospectionResponse(isActive, username, "access_token", expiresAt);
        } catch (Exception e) {
            return new IntrospectionResponse(false, null, null, 0);
        }
    }

} 