package com.azdev.hirgobackend.dtos.auth;

import com.azdev.hirgobackend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TokenIntrospectionResponse {
    private boolean active;
    private String subject; // email
    private Long userId;
    private Role role;
    private Long profileId;
    private String tokenType; // ACCESS, REFRESH, ID
    private Date issuedAt;
    private Date expiresAt;
} 