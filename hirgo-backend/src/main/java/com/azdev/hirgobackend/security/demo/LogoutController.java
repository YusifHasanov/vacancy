//package com.azdev.hirgobackend.security.demo;
//
//import java.time.Instant;
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;
//import org.springframework.security.oauth2.jwt.JwtDecoder;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import jakarta.servlet.http.HttpServletRequest;
//
///**
// * Controller specifically for logout operations
// */
//@RestController
//public class LogoutController {
//
//    private static final Logger log = LogManager.getLogger(LogoutController.class);
//    private final TokenBlacklistService blacklistService;
//    private final JwtDecoder jwtDecoder;
//
//    public LogoutController(TokenBlacklistService blacklistService, JwtDecoder jwtDecoder) {
//        this.blacklistService = blacklistService;
//        this.jwtDecoder = jwtDecoder;
//        log.info("LogoutController initialized");
//    }
//
//    /**
//     * Simple GET endpoint for testing
//     */
//    @GetMapping("/api/logout/ping")
//    public String ping() {
//        log.info("Logout ping endpoint called");
//        return "Logout controller is working";
//    }
//
//    /**
//     * Very simple POST logout endpoint
//     */
//    @PostMapping("/api/logout/simple")
//    public String simpleLogout() {
//        log.info("Simple logout endpoint called in LogoutController");
//        return "Simple logout successful";
//    }
//
//    /**
//     * Logout with token validation and blacklisting
//     */
//    @PostMapping("/api/logout/full")
//    public String fullLogout(@RequestParam(required = false) String token,
//                             @RequestParam(required = false) String refreshToken,
//                             HttpServletRequest request) {
//
//        log.info("Full logout endpoint called with token param: {}, refreshToken param: {}",
//                token != null ? "provided" : "not provided",
//                refreshToken != null ? "provided" : "not provided");
//
//        try {
//            boolean tokenInvalidated = false;
//            String username = null;
//
//            // First, try to use the explicit token parameter if provided
//            if (token != null && !token.isBlank()) {
//                try {
//                    org.springframework.security.oauth2.jwt.Jwt jwt = jwtDecoder.decode(token);
//                    String tokenType = jwt.getClaimAsString("token_type");
//                    username = jwt.getSubject();
//
//                    // Blacklist the token
//                    blacklistService.blacklistToken(token, jwt.getExpiresAt());
//                    log.info("Token blacklisted on logout: {}", tokenType);
//                    tokenInvalidated = true;
//                } catch (Exception e) {
//                    log.warn("Failed to blacklist token: {}", e.getMessage());
//                }
//            }
//
//            // Then try to extract from Authorization header
//            String authHeader = request.getHeader("Authorization");
//            if (authHeader != null && authHeader.startsWith("Bearer ")) {
//                String bearerToken = authHeader.substring(7); // Remove "Bearer " prefix
//                try {
//                    org.springframework.security.oauth2.jwt.Jwt jwt = jwtDecoder.decode(bearerToken);
//                    String tokenType = jwt.getClaimAsString("token_type");
//                    username = jwt.getSubject();
//
//                    blacklistService.blacklistToken(bearerToken, jwt.getExpiresAt());
//                    log.info("Bearer token blacklisted on logout: {}", tokenType);
//                    tokenInvalidated = true;
//                } catch (Exception e) {
//                    log.warn("Failed to blacklist bearer token: {}", e.getMessage());
//                }
//            }
//
//            // Finally, handle refresh token if provided explicitly
//            if (refreshToken != null && !refreshToken.isBlank()) {
//                try {
//                    org.springframework.security.oauth2.jwt.Jwt jwt = jwtDecoder.decode(refreshToken);
//                    username = jwt.getSubject();
//
//                    blacklistService.blacklistToken(refreshToken, jwt.getExpiresAt());
//                    log.info("Refresh token blacklisted on logout");
//                    tokenInvalidated = true;
//
//                    // If this refresh token has a reference to an access token, blacklist that too
//                    String associatedAccessToken = jwt.getClaimAsString("associated_access_token");
//                    if (associatedAccessToken != null) {
//                        blacklistService.blacklistToken(associatedAccessToken, jwt.getExpiresAt());
//                        log.info("Associated access token blacklisted from refresh token");
//                    }
//                } catch (Exception e) {
//                    log.warn("Failed to blacklist refresh token: {}", e.getMessage());
//                }
//            }
//
//            // Blacklist all tokens for this user using the token blacklist service's method
//            if (username != null) {
//                blacklistService.blacklistAllUserTokens(username);
//                log.info("Blacklisted all tokens for user: {}", username);
//            }
//
//            if (tokenInvalidated) {
//                return "Logout successful";
//            } else {
//                return "No tokens were blacklisted during logout";
//            }
//
//        } catch (Exception e) {
//            log.error("Logout operation failed", e);
//            return "Logout failed: " + e.getMessage();
//        }
//    }
//}