package com.azdev.hirgobackend.utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Utility class for hashing IP addresses
 */
@Slf4j
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class IpHashUtils {

    private static final String SALT = "HirgoViewCountSalt"; // Salt to make hash more secure
    
    /**
     * Hashes an IP address and vacancy ID combination to create a unique identifier
     * 
     * @param ip The IP address
     * @param vacancyId The vacancy ID
     * @return A hashed string representing this unique view
     */
    public static String hashIpAndVacancyId(String ip, String vacancyId) {
        String combined = ip + SALT + vacancyId;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(combined.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            log.error("Failed to hash IP and vacancy ID", e);
            // Fallback to a simple hash if SHA-256 is not available
            return String.valueOf(combined.hashCode());
        }
    }
    
    /**
     * Anonymizes an IP address for logging purposes while keeping it useful for debugging
     * 
     * @param ip The original IP address
     * @return Partially anonymized IP (last octet replaced with x)
     */
    public static String anonymizeIp(String ip) {
        if (ip == null || ip.isEmpty()) {
            return "unknown";
        }
        
        // Handle IPv6 addresses
        if (ip.contains(":")) {
            // Replace the last segment with x
            int lastColonIndex = ip.lastIndexOf(':');
            if (lastColonIndex > 0) {
                return ip.substring(0, lastColonIndex + 1) + "xxxx";
            }
            return ip;
        }
        
        // Handle IPv4 addresses
        int lastDotIndex = ip.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return ip.substring(0, lastDotIndex + 1) + "x";
        }
        
        return ip;
    }
} 