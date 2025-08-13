package com.azdev.hirgobackend.security.service;

import com.azdev.hirgobackend.enums.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Map;
import lombok.extern.log4j.Log4j2;

/**
 * Service to get information about the currently authenticated user
 */
@Service
@Log4j2
public class CurrentUserService {

    /**
     * Get the email of the currently authenticated user
     *
     * @return The user's email or null if not authenticated
     */
    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }
        
        if (authentication instanceof JwtAuthenticationToken) {
            return ((JwtAuthenticationToken) authentication).getToken().getSubject();
        }
        
        return authentication.getName();
    }
    
    /**
     * Get the role of the currently authenticated user
     *
     * @return The user's role or null if not authenticated
     */
    public Role getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }
        
        if (authentication instanceof JwtAuthenticationToken) {
            Jwt jwt = ((JwtAuthenticationToken) authentication).getToken();
            String role = jwt.getClaimAsString("role");
            if (role != null) {
                return Role.valueOf(role);
            }
        }
        
        // Fallback to checking authorities
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        if (authorities != null && !authorities.isEmpty()) {
            for (GrantedAuthority authority : authorities) {
                String authorityName = authority.getAuthority();
                if (authorityName.startsWith("ROLE_")) {
                    try {
                        return Role.valueOf(authorityName);
                    } catch (IllegalArgumentException e) {
                        // Not a known role enum value
                    }
                }
            }
        }
        
        return null;
    }
    
    /**
     * Check if the current user has the role of company
     *
     * @return true if the user is a company, false otherwise
     */
    public boolean isCurrentUserCompany() {
        Role role = getCurrentUserRole();
        return role == Role.ROLE_COMPANY;
    }
    
    /**
     * Check if the current user has the role of applicant
     *
     * @return true if the user is an applicant, false otherwise
     */
    public boolean isCurrentUserApplicant() {
        Role role = getCurrentUserRole();
        return role == Role.ROLE_APPLICANT;
    }
    
    /**
     * Get the profile ID (company ID) of the currently authenticated user
     *
     * @return The user's company ID or null if not authenticated or not a company
     * @throws RuntimeException if the profile ID claim is missing from the token
     */
    public Long getCurrentCompanyId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            log.error("Cannot get company ID: No authentication found in security context");
            throw new RuntimeException("User not authenticated");
        }
        
        if (authentication instanceof JwtAuthenticationToken) {
            Jwt jwt = ((JwtAuthenticationToken) authentication).getToken();
            
            // Log all claims for debugging
            Map<String, Object> claims = jwt.getClaims();
            log.debug("JWT token claims: {}", claims);
            
            // Extract the company profile ID from the token
            Object profileIdClaim = jwt.getClaim("profileId");
            if (profileIdClaim == null) {
                log.error("Profile ID claim is missing from the token");
                throw new RuntimeException("Profile ID claim is missing from the token");
            }
            
            try {
                if (profileIdClaim instanceof Number) {
                    return ((Number) profileIdClaim).longValue();
                } else if (profileIdClaim instanceof String) {
                    return Long.parseLong((String) profileIdClaim);
                } else {
                    log.error("Profile ID claim has unexpected type: {}", profileIdClaim.getClass().getName());
                    throw new RuntimeException("Profile ID claim is not a number: " + profileIdClaim);
                }
            } catch (Exception e) {
                log.error("Error parsing profile ID: {}", e.getMessage(), e);
                throw new RuntimeException("Error parsing profile ID: " + e.getMessage());
            }
        }
        
        log.error("Cannot get company ID: Authentication is not a JWT token");
        throw new RuntimeException("Authentication method not supported");
    }
} 