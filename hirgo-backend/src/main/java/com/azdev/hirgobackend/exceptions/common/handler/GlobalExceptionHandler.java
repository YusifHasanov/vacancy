package com.azdev.hirgobackend.exceptions.common.handler;

import java.util.HashMap;
import java.util.Map;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.azdev.hirgobackend.exceptions.common.base.BaseException;
import com.azdev.hirgobackend.dtos.common.response.CommonResponse;

import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;

@RestControllerAdvice
@Log4j2
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<CommonResponse<?>> handleBaseException(
            BaseException ex,
            WebRequest request) {
        log.error("BaseException occurred: {}", ex.getMessage(), ex); // Log the error
        return ResponseEntity.status(ex.getStatus())
                .body(CommonResponse.error(ex.getMessage(), ex.getStatus()));
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<CommonResponse<?>> handleAuthorizationDeniedException(
            AuthorizationDeniedException ex,
            WebRequest request) {
        log.error("AuthorizationDeniedException occurred: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED.value())
                .body(CommonResponse.error(ex.getMessage(), HttpStatus.UNAUTHORIZED));
    }



    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponse<?>> handleGlobalException(
            Exception ex,
            WebRequest request) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex); // Log the full stack trace
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(CommonResponse.error("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR));
    }

    /**
     * Handle validation errors for request bodies
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        log.warn("Validation error in request: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    /**
     * Handle authentication errors
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationExceptions(BadCredentialsException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Authentication failed");
        error.put("message", ex.getMessage());
        log.warn("Authentication error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    /**
     * Generic error handler for all other exceptions
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeExceptions(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "An error occurred");
        error.put("message", ex.getMessage());
        log.error("Runtime error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    /**
     * Handle specific registration errors
     */
    @ExceptionHandler(RegistrationException.class)
    public ResponseEntity<Map<String, String>> handleRegistrationExceptions(RegistrationException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Registration failed");
        error.put("message", ex.getMessage());
        log.warn("Registration error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Custom exception for registration-specific errors
     */
    public static class RegistrationException extends RuntimeException {
        public RegistrationException(String message) {
            super(message);
        }

        public RegistrationException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}