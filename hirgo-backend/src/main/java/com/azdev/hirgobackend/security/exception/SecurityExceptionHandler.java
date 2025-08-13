package com.azdev.hirgobackend.security.exception;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Exception handler for security-related exceptions
 */
@RestControllerAdvice
public class SecurityExceptionHandler {
    
    private static final Logger log = LogManager.getLogger(SecurityExceptionHandler.class);
    
    /**
     * Handle authentication exceptions
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(AuthenticationException ex) {
        log.error("Authentication error: {}", ex.getMessage());
        
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("status", HttpStatus.UNAUTHORIZED.value());
        response.put("error", "Authentication Failed");
        response.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    
    /**
     * Handle bad credentials specifically
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentialsException(BadCredentialsException ex) {
        log.error("Invalid credentials: {}", ex.getMessage());
        
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("status", HttpStatus.UNAUTHORIZED.value());
        response.put("error", "Invalid Credentials");
        response.put("message", "Email or password is incorrect");
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    
    /**
     * Handle JWT token exceptions
     */
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Map<String, Object>> handleJwtException(JwtException ex) {
        log.error("JWT error: {}", ex.getMessage());
        
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("status", HttpStatus.UNAUTHORIZED.value());
        response.put("error", "Token Error");
        response.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    
    /**
     * Handle token validation/refresh exceptions
     */
    @ExceptionHandler({TokenValidationException.class})
    public ResponseEntity<Map<String, Object>> handleTokenValidationException(RuntimeException ex) {
        log.error("Token validation error: {}", ex.getMessage());
        
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("status", HttpStatus.UNAUTHORIZED.value());
        response.put("error", "Token Invalid");
        response.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    
    /**
     * Custom exception for token validation errors
     */
    public static class TokenValidationException extends RuntimeException {
        public TokenValidationException(String message) {
            super(message);
        }
        
        public TokenValidationException(String message, Throwable cause) {
            super(message, cause);
        }
    }
} 