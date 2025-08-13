//package com.azdev.hirgobackend.backuptemp;
//
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;
//import org.springframework.core.convert.converter.Converter;
//import org.springframework.security.authentication.AbstractAuthenticationToken;
//import org.springframework.security.oauth2.jwt.Jwt;
//import org.springframework.security.oauth2.jwt.JwtException;
//import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
//import org.springframework.stereotype.Component;
//
///**
// * Custom JWT converter that checks if a token is blacklisted before allowing authentication
// */
//@Component
//public class BlacklistAwareJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
//
//    private static final Logger log = LogManager.getLogger(BlacklistAwareJwtAuthenticationConverter.class);
//    private final JwtAuthenticationConverter delegate = new JwtAuthenticationConverter();
//    private final TokenBlacklistService blacklistService;
//
//    public BlacklistAwareJwtAuthenticationConverter(TokenBlacklistService blacklistService) {
//        this.blacklistService = blacklistService;
//        log.info("BlacklistAwareJwtAuthenticationConverter initialized");
//    }
//
//    @Override
//    public AbstractAuthenticationToken convert(Jwt jwt) {
//        // Check if the token is blacklisted
//        String tokenValue = jwt.getTokenValue();
//        if (blacklistService.isBlacklisted(tokenValue)) {
//            String subject = jwt.getSubject();
//            String tokenType = jwt.getClaimAsString("token_type");
//            log.warn("Rejected blacklisted {} token for user: {}", tokenType, subject);
//            throw new JwtException("Token has been revoked");
//        }
//
//        // If not blacklisted, delegate to the standard JWT converter
//        try {
//            return delegate.convert(jwt);
//        } catch (Exception e) {
//            log.error("Error converting JWT token: {}", e.getMessage());
//            throw e;
//        }
//    }
//}