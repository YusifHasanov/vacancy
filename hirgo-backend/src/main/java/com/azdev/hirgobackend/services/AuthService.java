//package com.azdev.hirgobackend.services;
//
//import com.azdev.hirgobackend.dtos.auth.ApplicantRegisterRequest;
//import com.azdev.hirgobackend.dtos.auth.AuthResponse;
//import com.azdev.hirgobackend.dtos.auth.CompanyRegisterRequest;
//import com.azdev.hirgobackend.dtos.auth.LoginRequest;
//import com.azdev.hirgobackend.dtos.auth.LogoutRequest;
//import com.azdev.hirgobackend.dtos.auth.LogoutResponse;
//import com.azdev.hirgobackend.dtos.auth.RefreshTokenRequest;
//import com.azdev.hirgobackend.dtos.auth.RegisterRequest;
//import com.azdev.hirgobackend.dtos.auth.TokenIntrospectionResponse;
//import com.azdev.hirgobackend.enums.Role;
//import com.azdev.hirgobackend.models.applicant.Applicant;
//import com.azdev.hirgobackend.models.company.Company;
//import com.azdev.hirgobackend.models.user.User;
//import com.azdev.hirgobackend.repositories.ApplicantRepository;
//import com.azdev.hirgobackend.repositories.CompanyRepository;
//import com.azdev.hirgobackend.repositories.UserRepository;
//import com.azdev.hirgobackend.security.JwtService;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.UUID;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Service
//@RequiredArgsConstructor
//public class AuthService {
//
//    private final UserRepository userRepository;
//    private final CompanyRepository companyRepository;
//    private final ApplicantRepository applicantRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final JwtService jwtService;
//    private final AuthenticationManager authenticationManager;
//
//    @Transactional
//    public AuthResponse registerCompany(CompanyRegisterRequest request) {
//        // Check if email already exists
//        if (userRepository.existsByEmail(request.getEmail())) {
//            throw new RuntimeException("Email already exists");
//        }
//
//        // Create company profile
//        Company company = new Company();
//        company.setName(request.getName());
//        company.setPhoneNumber(request.getPhone());
//
//        company = companyRepository.save(company);
//        Long profileId = company.getId();
//
//        // Create user with company role
//        User user = User.builder()
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .role(Role.ROLE_COMPANY)
//                .profileId(profileId)
//                .accountNonExpired(true)
//                .accountNonLocked(true)
//                .credentialsNonExpired(true)
//                .enabled(true)
//                .build();
//
//        user = userRepository.save(user);
//
//        // Generate tokens
//        return generateAuthResponse(user);
//    }
//
//    @Transactional
//    public AuthResponse registerApplicant(ApplicantRegisterRequest request) {
//        // Check if email already exists
//        if (userRepository.existsByEmail(request.getEmail())) {
//            throw new RuntimeException("Email already exists");
//        }
//
//        // Create applicant profile
//        Applicant applicant = new Applicant();
//        applicant.setFirstName(request.getFirstName());
//        applicant.setLastName(request.getLastName());
//        applicant.setEmail(request.getEmail());
//        applicant.setDateOfBirth(request.getDateOfBirth());
//        applicant.setCreatedAt(LocalDateTime.now());
//        applicant.setUpdatedAt(LocalDateTime.now());
//
//        applicant = applicantRepository.save(applicant);
//        Long profileId = applicant.getId();
//
//        // Create user with applicant role
//        User user = User.builder()
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .role(Role.ROLE_APPLICANT)
//                .profileId(profileId)
//                .accountNonExpired(true)
//                .accountNonLocked(true)
//                .credentialsNonExpired(true)
//                .enabled(true)
//                .build();
//
//        user = userRepository.save(user);
//
//        // Generate tokens
//        return generateAuthResponse(user);
//    }
//
//    /**
//     * Authenticates a user and returns tokens
//     */
//    public AuthResponse login(LoginRequest request) {
//        try {
//            // Authenticate user - this will throw an exception if authentication fails
//            authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            request.getEmail(),
//                            request.getPassword()
//                    )
//            );
//
//            // If we get here, authentication was successful
//            // Get user - we need to do this query to get the user details
//            User user = userRepository.findByEmail(request.getEmail())
//                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//            // Generate tokens
//            return generateAuthResponse(user);
//        } catch (Exception e) {
//            // Log the error for debugging
//            System.err.println("Login error: " + e.getMessage());
//            throw new RuntimeException("Authentication failed: " + e.getMessage());
//        }
//    }
//
//    /**
//     * Refreshes an access token using a refresh token
//     */
//    @Transactional
//    public AuthResponse refreshToken(RefreshTokenRequest request) {
//        String refreshToken = request.getRefreshToken();
//
//        try {
//            // Verify this is actually a refresh token
//            if (!jwtService.isRefreshToken(refreshToken)) {
//                throw new RuntimeException("Invalid token type: Only refresh tokens are accepted");
//            }
//
//            // Extract username from refresh token
//            String username = jwtService.extractUsername(refreshToken);
//
//            // Extract token family
//            String tokenFamily = jwtService.extractTokenFamily(refreshToken);
//            if (tokenFamily == null) {
//                throw new RuntimeException("Invalid refresh token: No token family found");
//            }
//
//            // Check if the refresh token is valid
//            User user = userRepository.findByEmail(username)
//                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//            if (!jwtService.isTokenValid(refreshToken, user)) {
//                throw new RuntimeException("Invalid refresh token");
//            }
//
//            // Invalidate the current refresh token
//            jwtService.invalidateToken(refreshToken);
//
//            // Generate new tokens with a new family
//            String newTokenFamily = UUID.randomUUID().toString();
//            JwtService.AuthTokens tokens = jwtService.generateTokensWithFamily(user, newTokenFamily);
//
//            return AuthResponse.builder()
//                    .accessToken(tokens.getAccessToken())
//                    .refreshToken(tokens.getRefreshToken())
//                    .idToken(tokens.getIdToken())
//                    .userId(user.getId())
//                    .role(user.getRole())
//                    .profileId(user.getProfileId())
//                    .build();
//        } catch (Exception e) {
//            throw new RuntimeException("Invalid refresh token: " + e.getMessage());
//        }
//    }
//
//    /**
//     * Introspects a token and returns information about it
//     */
//    public TokenIntrospectionResponse introspectToken(String token) {
//        return jwtService.introspectToken(token);
//    }
//
//    /**
//     * Logs out a user by invalidating their access token
//     */
//    public LogoutResponse logout(LogoutRequest request) {
//        String accessToken = request.getAccessToken();
//
//        try {
//            // Verify this is actually an access token
//            if (!jwtService.isAccessToken(accessToken)) {
//                throw new RuntimeException("Invalid token type: Only access tokens can be logged out");
//            }
//
//            // Extract token family
//            String tokenFamily = jwtService.extractTokenFamily(accessToken);
//
//            // Invalidate the specific token
//            jwtService.invalidateToken(accessToken);
//
//            return LogoutResponse.builder()
//                    .success(true)
//                    .message("Successfully logged out")
//                    .build();
//        } catch (Exception e) {
//            return LogoutResponse.builder()
//                    .success(false)
//                    .message("Failed to logout: " + e.getMessage())
//                    .build();
//        }
//    }
//
//    private AuthResponse generateAuthResponse(User user) {
//        // Generate a token family
//        String tokenFamily = UUID.randomUUID().toString();
//
//        // Generate tokens with the same family
//        JwtService.AuthTokens tokens = jwtService.generateTokensWithFamily(user, tokenFamily);
//
//        return AuthResponse.builder()
//                .accessToken(tokens.getAccessToken())
//                .refreshToken(tokens.getRefreshToken())
//                .idToken(tokens.getIdToken())
//                .userId(user.getId())
//                .role(user.getRole())
//                .profileId(user.getProfileId())
//                .build();
//    }
//}