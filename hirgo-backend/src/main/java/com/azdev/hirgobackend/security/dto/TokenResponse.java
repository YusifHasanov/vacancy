package com.azdev.hirgobackend.security.dto;

import com.azdev.hirgobackend.enums.Role;

/**
 * Data Transfer Object representing a set of authentication tokens.
 * Contains access token, refresh token, and ID token.
 */
public record TokenResponse(String accessToken, String refreshToken, String idToken, Role userRole) {
} 