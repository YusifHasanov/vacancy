package com.azdev.hirgobackend.utils;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Utility class for HTTP request related functions
 */
@Slf4j
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RequestUtils {

    /**
     * Extracts the client IP address from an HTTP request, taking into account
     * proxy headers like X-Forwarded-For
     *
     * @param request The HTTP request to extract the IP from
     * @return The client's IP address
     */
    public static String getClientIpAddress(HttpServletRequest request) {
        String ip = null;
        
        // Try X-Forwarded-For header first (for clients behind proxies)
        ip = request.getHeader("X-Forwarded-For");
        
        if (isInvalidIp(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        
        if (isInvalidIp(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        
        if (isInvalidIp(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        
        if (isInvalidIp(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        
        if (isInvalidIp(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // Handle X-Forwarded-For format with multiple IPs (first one is the original client)
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        log.debug("Client IP address extracted: {}", IpHashUtils.anonymizeIp(ip));
        return ip;
    }
    
    /**
     * Checks if an IP address is invalid or missing
     * 
     * @param ip The IP address to check
     * @return true if the IP is invalid or missing
     */
    private static boolean isInvalidIp(String ip) {
        return ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip);
    }
} 