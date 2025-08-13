package com.azdev.hirgobackend.dtos.auth;

import com.azdev.hirgobackend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String idToken;
    private Long userId;
    private Role role;
    private Long profileId;
} 