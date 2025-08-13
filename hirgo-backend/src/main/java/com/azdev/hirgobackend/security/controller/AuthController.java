package com.azdev.hirgobackend.security.controller;

import com.azdev.hirgobackend.security.dto.IntrospectionResponse;
import com.azdev.hirgobackend.security.dto.LoginRequest;
import com.azdev.hirgobackend.security.dto.TokenResponse;
import com.azdev.hirgobackend.security.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller handling authentication operations like login, refresh token, and logout
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(allowedHeaders = "*", origins = "*")
public class AuthController {
    
    private static final Logger log = LogManager.getLogger(AuthController.class);
    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
        log.info("AuthController initialized");
    }
    
    /**
     * Login endpoint to authenticate users and generate tokens
     * 
     * @param loginRequest User credentials
     * @return Tokens for the authenticated user
     */
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        TokenResponse tokenResponse = authService.login(loginRequest);
        return ResponseEntity.ok(tokenResponse);
    }
    
    /**
     * Refresh token endpoint to generate new tokens with a valid refresh token
     * 
     * @param refreshToken The refresh token
     * @return New set of tokens
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<TokenResponse> refreshToken(@RequestParam String refreshToken) {
        TokenResponse tokenResponse = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(tokenResponse);
    }
    
    /**
     * Logout endpoint to invalidate tokens
     * 
     * @param token Access token to invalidate (optional)
     * @param refreshToken Refresh token to invalidate (optional)
     * @param request HTTP request to extract authorization header
     * @return Success message
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestParam(required = false) String token,
            @RequestParam(required = false) String refreshToken,
            HttpServletRequest request) {
        
        boolean tokenProcessed = authService.logout(token, refreshToken, request);
        
        if (tokenProcessed) {
            return ResponseEntity.ok("Logged out successfully");
        } else {
            return ResponseEntity.badRequest().body("No valid tokens provided for logout");
        }
    }

        /**
     * Introspect the access token to get its details
     * 
     * @param request The HTTP request containing the token
     * @return IntrospectionResponse with token details
     */
    @PostMapping("/introspect")
    public ResponseEntity<IntrospectionResponse> introspectToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            return ResponseEntity.ok(authService.introspectToken(token));
        } else {
            return ResponseEntity.badRequest().body(new IntrospectionResponse(false, null, null, 0));
        }
    }

} 