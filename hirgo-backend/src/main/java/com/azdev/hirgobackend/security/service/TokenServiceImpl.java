package com.azdev.hirgobackend.security.service;

import com.azdev.hirgobackend.models.user.User;
import java.util.UUID;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.stereotype.Service;

/**
 * Concrete implementation of TokenService with UserService dependency
 */
@Service
public class TokenServiceImpl extends TokenService {

    private final UserService userService;

    public TokenServiceImpl(JwtEncoder jwtEncoder, JwtDecoder jwtDecoder,
                            TokenBlacklistService blacklistService, UserService userService) {
        super(jwtEncoder, jwtDecoder, blacklistService, userService);
        this.userService = userService;
    }

    @Override
    protected User getUserByUsername(UUID userId) {
        return userService.findById(userId);
    }
} 