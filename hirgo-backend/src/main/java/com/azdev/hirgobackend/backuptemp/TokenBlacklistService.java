//package com.azdev.hirgobackend.backuptemp;
//
//import java.time.Instant;
//import java.util.Map;
//import java.util.Set;
//import java.util.concurrent.ConcurrentHashMap;
//import java.util.concurrent.ConcurrentSkipListSet;
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//
///**
// * Service to manage blacklisted JWT tokens
// */
//@Service
//public class TokenBlacklistService {
//
//    private static final Logger log = LogManager.getLogger(TokenBlacklistService.class);
//
//    // Map to store blacklisted tokens with their expiry time
//    private final Map<String, Instant> blacklistedTokens = new ConcurrentHashMap<>();
//
//    // Map to store user tokens by username
//    private final Map<String, Set<String>> userTokens = new ConcurrentHashMap<>();
//
//    /**
//     * Add a token to the blacklist with its expiry time
//     *
//     * @param token the token to blacklist
//     * @param expiryTime when the token expires
//     */
//    public void blacklistToken(String token, Instant expiryTime) {
//        blacklistedTokens.put(token, expiryTime);
//    }
//
//    /**
//     * Store a token for a specific user, so we can blacklist all their tokens on logout
//     *
//     * @param username the user's username/email
//     * @param token the token to associate with this user
//     */
//    public void storeUserToken(String username, String token) {
//        userTokens.computeIfAbsent(username, k -> new ConcurrentSkipListSet<>()).add(token);
//        log.debug("Stored token for user {}", username);
//    }
//
//    /**
//     * Blacklist all tokens for a specific user
//     *
//     * @param username the user whose tokens should be blacklisted
//     */
//    public void blacklistAllUserTokens(String username) {
//        Set<String> tokens = userTokens.get(username);
//        if (tokens != null) {
//            Instant now = Instant.now();
//            // Set expiry to 24 hours in the future to ensure they're blacklisted long enough
//            Instant expiryTime = now.plusSeconds(86400);
//
//            for (String token : tokens) {
//                blacklistedTokens.put(token, expiryTime);
//            }
//
//            log.info("Blacklisted {} tokens for user {}", tokens.size(), username);
//
//            // Clear the user's token set to free up memory
//            tokens.clear();
//        } else {
//            log.info("No tokens found to blacklist for user {}", username);
//        }
//    }
//
//    /**
//     * Check if a token is blacklisted
//     *
//     * @param token the token to check
//     * @return true if the token is blacklisted, false otherwise
//     */
//    public boolean isBlacklisted(String token) {
//        return blacklistedTokens.containsKey(token);
//    }
//
//    /**
//     * Scheduled task to clean up expired tokens from the blacklist
//     * Runs every hour
//     */
//    @Scheduled(fixedRate = 3600000) // Run every hour
//    public void cleanupExpiredTokens() {
//        Instant now = Instant.now();
//        int countBefore = blacklistedTokens.size();
//        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
//        int countAfter = blacklistedTokens.size();
//
//        log.info("Cleaned up {} expired tokens from blacklist", (countBefore - countAfter));
//    }
//}