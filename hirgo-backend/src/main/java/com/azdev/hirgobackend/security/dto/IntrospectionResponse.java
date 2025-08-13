package com.azdev.hirgobackend.security.dto;

public class IntrospectionResponse {
    private boolean active;
    private String username;
    private String tokenType;
    private long expiresAt;

    public IntrospectionResponse(boolean active, String username, String tokenType, long expiresAt) {
        this.active = active;
        this.username = username;
        this.tokenType = tokenType;
        this.expiresAt = expiresAt;
    }

    // Getters and Setters
    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public long getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(long expiresAt) {
        this.expiresAt = expiresAt;
    }
}