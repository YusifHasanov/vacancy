//package com.azdev.hirgobackend.security.demo;
//
//import com.azdev.hirgobackend.dtos.auth.ApplicantRegisterRequest;
//import com.azdev.hirgobackend.dtos.auth.CompanyRegisterRequest;
//import com.azdev.hirgobackend.enums.Role;
//import com.azdev.hirgobackend.exceptions.common.handler.GlobalExceptionHandler;
//import com.azdev.hirgobackend.models.applicant.Applicant;
//import com.azdev.hirgobackend.models.company.Company;
//import com.azdev.hirgobackend.models.user.User;
//import com.azdev.hirgobackend.repositories.ApplicantRepository;
//import com.azdev.hirgobackend.repositories.CompanyRepository;
//import com.azdev.hirgobackend.repositories.UserRepository;
//import java.time.Instant;
//import java.time.LocalDateTime;
//import java.util.UUID;
//import java.util.stream.Collectors;
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.oauth2.jwt.JwtClaimsSet;
//import org.springframework.security.oauth2.jwt.JwtDecoder;
//import org.springframework.security.oauth2.jwt.JwtEncoder;
//import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import com.azdev.hirgobackend.exceptions.common.handler.GlobalExceptionHandler.RegistrationException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.validation.Valid;
//import org.springframework.http.ResponseEntity;
//import org.springframework.transaction.annotation.Transactional;
//
//@RestController
//public class TokenController {
//
//    final JwtEncoder encoder;
//    private static final Logger log = LogManager.getLogger(TokenController.class);
//    private final JwtEncoder jwtEncoder;
//    private final JwtDecoder jwtDecoder;
//    private final AuthenticationManager authenticationManager;
//    private final PasswordEncoder passwordEncoder;
//    private final UserRepository userRepository;
//    private final TokenBlacklistService blacklistService;
//    private final CompanyRepository companyRepository;
//    private final ApplicantRepository applicantRepository;
//
//    public TokenController(JwtEncoder encoder, JwtEncoder jwtEncoder, JwtDecoder jwtDecoder,
//                         AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder,
//                         UserRepository userRepository, TokenBlacklistService blacklistService,
//                         CompanyRepository companyRepository, ApplicantRepository applicantRepository) {
//        this.encoder = encoder;
//        this.jwtEncoder = jwtEncoder;
//        this.jwtDecoder = jwtDecoder;
//        this.authenticationManager = authenticationManager;
//        this.passwordEncoder = passwordEncoder;
//        this.userRepository = userRepository;
//        this.blacklistService = blacklistService;
//        this.companyRepository = companyRepository;
//        this.applicantRepository = applicantRepository;
//    }
//
//    @GetMapping("/")
//    public String hello(Authentication authentication) {
//        return "Hello, " + authentication.getName() + "!";
//    }
//
//    /**
//     * @deprecated Use /register/company or /register/applicant instead.
//     * Company registration requires: company name, phone, email, password.
//     * Applicant registration requires: first name, last name, date of birth, phone, email, password.
//     */
//    @Deprecated
//    @PostMapping("/register")
//    public void register(@RequestBody User user) {
//        if (userRepository.existsByEmail(user.getEmail())) {
//            log.info("User with email {} already exists", user.getEmail());
//        }
//
//        // Hash the password before saving
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        userRepository.save(user);
//        log.info("User with email {} has been registered", user.getEmail());
//    }
//
//    /**
//     * Register a new company with the required fields:
//     * - Company Name
//     * - Phone Number
//     * - Email
//     * - Password
//     */
//    @PostMapping("/register/company")
//    @Transactional
//    public ResponseEntity<TokenResponse> registerCompany(@Valid @RequestBody CompanyRegisterRequest request) {
//        try {
//            // Check if email already exists
//            if (userRepository.existsByEmail(request.getEmail())) {
//                log.warn("Company registration failed: Email {} already exists", request.getEmail());
//                throw new RegistrationException("Email already exists");
//            }
//
//            // Create company profile with required fields
//            Company company = new Company();
//            company.setName(request.getName());
//            company.setPhoneNumber(request.getPhone());
//
//            company = companyRepository.save(company);
//            Long profileId = company.getId();
//
//            // Create user with company role
//            User user = User.builder()
//                    .email(request.getEmail())
//                    .password(passwordEncoder.encode(request.getPassword()))
//                    .role(Role.ROLE_COMPANY)
//                    .profileId(profileId)
//                    .accountNonExpired(true)
//                    .accountNonLocked(true)
//                    .credentialsNonExpired(true)
//                    .enabled(true)
//                    .build();
//
//            user = userRepository.save(user);
//            log.info("Company with email {} has been registered successfully", request.getEmail());
//
//            // Generate tokens for authentication
//            return ResponseEntity.ok(generateTokenResponse(user));
//        } catch (RegistrationException e) {
//            throw e;
//        } catch (Exception e) {
//            log.error("Error during company registration: {}", e.getMessage(), e);
//            throw new RegistrationException("Registration failed: " + e.getMessage(), e);
//        }
//    }
//
//    /**
//     * Register a new applicant with the required fields:
//     * - First Name
//     * - Last Name
//     * - Date of Birth
//     * - Email
//     * - Password
//     * - Phone Number
//     */
//    @PostMapping("/register/applicant")
//    @Transactional
//    public ResponseEntity<TokenResponse> registerApplicant(@Valid @RequestBody ApplicantRegisterRequest request) {
//        try {
//            // Check if email already exists
//            if (userRepository.existsByEmail(request.getEmail())) {
//                log.warn("Applicant registration failed: Email {} already exists", request.getEmail());
//                throw new RegistrationException("Email already exists");
//            }
//
//            // Create applicant profile with required fields
//            Applicant applicant = new Applicant();
//            applicant.setFirstName(request.getFirstName());
//            applicant.setLastName(request.getLastName());
//            applicant.setEmail(request.getEmail());
//            applicant.setDateOfBirth(request.getDateOfBirth());
//            applicant.setPhone(request.getPhone());
//            applicant.setCreatedAt(LocalDateTime.now());
//            applicant.setUpdatedAt(LocalDateTime.now());
//
//            applicant = applicantRepository.save(applicant);
//            Long profileId = applicant.getId();
//
//            // Create user with applicant role
//            User user = User.builder()
//                    .email(request.getEmail())
//                    .password(passwordEncoder.encode(request.getPassword()))
//                    .role(Role.ROLE_APPLICANT)
//                    .profileId(profileId)
//                    .accountNonExpired(true)
//                    .accountNonLocked(true)
//                    .credentialsNonExpired(true)
//                    .enabled(true)
//                    .build();
//
//            user = userRepository.save(user);
//            log.info("Applicant with email {} has been registered successfully", request.getEmail());
//
//            // Generate tokens for authentication
//            return ResponseEntity.ok(generateTokenResponse(user));
//        } catch (RegistrationException e) {
//            throw e;
//        } catch (Exception e) {
//            log.error("Error during applicant registration: {}", e.getMessage(), e);
//            throw new RegistrationException("Registration failed: " + e.getMessage(), e);
//        }
//    }
//
//    @PostMapping("/login")
//    public TokenResponse login(@RequestParam String email, @RequestParam String password) {
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(email, password));
//
//        Instant now = Instant.now();
//
//        // Access token expiry (1 hour)
//        long accessTokenExpiry = 3600L;
//
//        // Refresh token expiry (7 days)
//        long refreshTokenExpiry = 604800L;
//
//        // ID token expiry (1 hour)
//        long idTokenExpiry = 3600L;
//
//        String roles = authentication.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority)
//                .collect(Collectors.joining(" "));
//
//        // Generate access token with a unique ID
//        String accessTokenJti = UUID.randomUUID().toString();
//        JwtClaimsSet accessTokenClaims = JwtClaimsSet.builder()
//                .issuer("self")
//                .issuedAt(now)
//                .expiresAt(now.plusSeconds(accessTokenExpiry))
//                .subject(authentication.getName())
//                .claim("role", roles)
//                .claim("token_type", "access_token")
//                .claim("jti", accessTokenJti)
//                .build();
//
//        String accessToken = jwtEncoder.encode(JwtEncoderParameters.from(accessTokenClaims)).getTokenValue();
//
//        // Store the access token for this user
//        blacklistService.storeUserToken(authentication.getName(), accessToken);
//
//        // Generate refresh token with reference to the access token
//        JwtClaimsSet refreshTokenClaims = JwtClaimsSet.builder()
//                .issuer("self")
//                .issuedAt(now)
//                .expiresAt(now.plusSeconds(refreshTokenExpiry))
//                .subject(authentication.getName())
//                .claim("token_type", "refresh_token")
//                .claim("jti", UUID.randomUUID().toString())
//                .claim("associated_access_token", accessToken) // Store reference to the access token
//                .build();
//
//        String refreshToken = jwtEncoder.encode(JwtEncoderParameters.from(refreshTokenClaims)).getTokenValue();
//
//        // Store the refresh token for this user
//        blacklistService.storeUserToken(authentication.getName(), refreshToken);
//
//        // Generate ID token with user-specific claims
//        User user = userRepository.findByEmail(authentication.getName())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        JwtClaimsSet idTokenClaims = JwtClaimsSet.builder()
//                .issuer("self")
//                .issuedAt(now)
//                .expiresAt(now.plusSeconds(idTokenExpiry))
//                .subject(authentication.getName())
//                .claim("token_type", "id_token")
//                .claim("email", user.getEmail())
//                .claim("name", user.getUsername())
//                .claim("auth_time", now.getEpochSecond())
//                .build();
//
//        String idToken = jwtEncoder.encode(JwtEncoderParameters.from(idTokenClaims)).getTokenValue();
//
//        // Store the ID token for this user
//        blacklistService.storeUserToken(authentication.getName(), idToken);
//
//        log.info("Generated and stored tokens for user: {}", authentication.getName());
//
//        return new TokenResponse(accessToken, refreshToken, idToken);
//    }
//
//    @GetMapping("/pr")
//    public void demo(Authentication authentication) {
//        log.info("Protected source! {}", authentication.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority)
//                .map(s -> s.replace("SCOPE_", ""))
//                .collect(Collectors.toList()));
//    }
//
//    @PostMapping("/refresh-token")
//    public TokenResponse refreshToken(@RequestParam String refreshToken) {
//        try {
//            // Validate the refresh token
//            org.springframework.security.oauth2.jwt.Jwt jwt = jwtDecoder.decode(refreshToken);
//
//            // Check if it's a refresh token
//            String tokenType = jwt.getClaimAsString("token_type");
//            if (!"refresh_token".equals(tokenType)) {
//                throw new RuntimeException("Invalid token type");
//            }
//
//            // Extract the access token's jti if it exists in the refresh token claims
//            // This would require storing the access token jti in the refresh token when it's created
//            String associatedAccessToken = jwt.getClaimAsString("associated_access_token");
//            if (associatedAccessToken != null) {
//                // Get the expiry time of the original access token
//                Instant expiryTime = jwt.getExpiresAt();
//                if (expiryTime != null) {
//                    // Blacklist the old access token
//                    blacklistService.blacklistToken(associatedAccessToken, expiryTime);
//                    log.info("Blacklisted access token: {}", associatedAccessToken);
//                }
//            }
//
//            // Get the subject (username/email) from the refresh token
//            String username = jwt.getSubject();
//
//            // Look up the user
//            User user = userRepository.findByEmail(username)
//                    .orElseThrow(() -> new RuntimeException("User not found"));
//
//            Instant now = Instant.now();
//
//            // Access token expiry (1 hour)
//            long accessTokenExpiry = 3600L;
//
//            // ID token expiry (1 hour)
//            long idTokenExpiry = 3600L;
//
//            // Generate a new refresh token (7 days)
//            long refreshTokenExpiry = 604800L;
//
//            String roles = user.getAuthorities().stream()
//                    .map(GrantedAuthority::getAuthority)
//                    .collect(Collectors.joining(" "));
//
//            // Generate new access token
//            String newAccessTokenJti = UUID.randomUUID().toString();
//            JwtClaimsSet accessTokenClaims = JwtClaimsSet.builder()
//                    .issuer("self")
//                    .issuedAt(now)
//                    .expiresAt(now.plusSeconds(accessTokenExpiry))
//                    .subject(username)
//                    .claim("role", roles)
//                    .claim("token_type", "access_token")
//                    .claim("jti", newAccessTokenJti)
//                    .build();
//
//            String newAccessToken = jwtEncoder.encode(JwtEncoderParameters.from(accessTokenClaims)).getTokenValue();
//
//            // Store the new access token for this user
//            blacklistService.storeUserToken(username, newAccessToken);
//
//            // Generate new refresh token with reference to the access token
//            JwtClaimsSet refreshTokenClaims = JwtClaimsSet.builder()
//                    .issuer("self")
//                    .issuedAt(now)
//                    .expiresAt(now.plusSeconds(refreshTokenExpiry))
//                    .subject(username)
//                    .claim("token_type", "refresh_token")
//                    .claim("jti", UUID.randomUUID().toString())
//                    .claim("associated_access_token", newAccessToken) // Store reference to the access token
//                    .build();
//
//            String newRefreshToken = jwtEncoder.encode(JwtEncoderParameters.from(refreshTokenClaims)).getTokenValue();
//
//            // Store the new refresh token for this user
//            blacklistService.storeUserToken(username, newRefreshToken);
//
//            // Generate new ID token
//            JwtClaimsSet idTokenClaims = JwtClaimsSet.builder()
//                    .issuer("self")
//                    .issuedAt(now)
//                    .expiresAt(now.plusSeconds(idTokenExpiry))
//                    .subject(username)
//                    .claim("token_type", "id_token")
//                    .claim("email", user.getEmail())
//                    .claim("name", user.getUsername())
//                    .claim("auth_time", now.getEpochSecond())
//                    .build();
//
//            String newIdToken = jwtEncoder.encode(JwtEncoderParameters.from(idTokenClaims)).getTokenValue();
//
//            // Store the new ID token for this user
//            blacklistService.storeUserToken(username, newIdToken);
//
//            // Blacklist the old refresh token too so it can't be reused
//            blacklistService.blacklistToken(refreshToken, jwt.getExpiresAt());
//            log.info("Blacklisted refresh token after use and stored new tokens for user: {}", username);
//
//            return new TokenResponse(newAccessToken, newRefreshToken, newIdToken);
//
//        } catch (Exception e) {
//            log.error("Error refreshing token", e);
//            throw new RuntimeException("Invalid refresh token");
//        }
//    }
//
//    @GetMapping("/test-auth")
//    public void testAuth(Authentication authentication) {
//        log.info("You are authenticated as: {} with roles: {}", authentication.getName(), authentication.getAuthorities());
//    }
//
//    /**
//     * Simple test endpoint to check if the logout functionality is accessible
//     */
//    @PostMapping("/test-logout")
//    public String testLogout() {
//        log.info("Test logout endpoint called successfully");
//        return "Test logout endpoint called successfully";
//    }
//
//    /**
//     * Super simple logout endpoint at a different path
//     */
//    @PostMapping("/api/auth/logout")
//    public String simpleLogout() {
//        log.info("Simple logout endpoint called at /api/auth/logout");
//        return "Simple logout called";
//    }
//
//    /**
//     * GET logout endpoint for easier testing
//     */
//    @GetMapping("/logout-get")
//    public String logoutGet(@RequestParam(required = false) String token) {
//        log.info("GET logout endpoint called with token: {}", token != null ? token.substring(0, Math.min(10, token.length())) + "..." : "null");
//        return "GET logout endpoint called successfully";
//    }
//
//    /**
//     * Logout endpoint that invalidates the current access token and optionally the refresh token
//     * The access token can be extracted from the Authorization header or provided explicitly
//     *
//     * @param refreshToken Optional refresh token to invalidate
//     * @param request The HTTP request to extract the Authorization header
//     * @return A message indicating the logout was successful
//     */
//    @PostMapping("/logout")
//    public String logout(@RequestParam(required = false) String token,
//                         @RequestParam(required = false) String refreshToken,
//                         HttpServletRequest request) {
//
//        log.info("Logout endpoint called with token param: {}, refreshToken param: {}",
//                token != null ? "provided" : "not provided",
//                refreshToken != null ? "provided" : "not provided");
//
//        try {
//            boolean tokenInvalidated = false;
//            String username = null;
//
//            // First, try to use the explicit token parameter if provided
//            if (token != null && !token.isBlank()) {
//                try {
//                    org.springframework.security.oauth2.jwt.Jwt jwt = jwtDecoder.decode(token);
//                    username = jwt.getSubject();
//                    blacklistService.blacklistToken(token, jwt.getExpiresAt());
//                    log.info("Token blacklisted on logout: {}", token.substring(0, 10) + "...");
//                    tokenInvalidated = true;
//                } catch (Exception e) {
//                    log.warn("Failed to blacklist token: {}", e.getMessage());
//                }
//            }
//
//            // Then try to extract from Authorization header
//            String authHeader = request.getHeader("Authorization");
//            if (authHeader != null && authHeader.startsWith("Bearer ")) {
//                String bearerToken = authHeader.substring(7); // Remove "Bearer " prefix
//                try {
//                    org.springframework.security.oauth2.jwt.Jwt jwt = jwtDecoder.decode(bearerToken);
//                    username = jwt.getSubject();
//                    blacklistService.blacklistToken(bearerToken, jwt.getExpiresAt());
//                    log.info("Bearer token blacklisted on logout: {}", bearerToken.substring(0, 10) + "...");
//                    tokenInvalidated = true;
//                } catch (Exception e) {
//                    log.warn("Failed to blacklist bearer token: {}", e.getMessage());
//                }
//            }
//
//            // Finally, handle refresh token if provided
//            if (refreshToken != null && !refreshToken.isBlank()) {
//                try {
//                    org.springframework.security.oauth2.jwt.Jwt jwt = jwtDecoder.decode(refreshToken);
//                    username = jwt.getSubject();
//                    blacklistService.blacklistToken(refreshToken, jwt.getExpiresAt());
//                    log.info("Refresh token blacklisted on logout");
//                    tokenInvalidated = true;
//                } catch (Exception e) {
//                    log.warn("Failed to blacklist refresh token: {}", e.getMessage());
//                }
//            }
//
//            // If we identified the user, blacklist all their tokens
//            if (username != null) {
//                blacklistService.blacklistAllUserTokens(username);
//                log.info("Blacklisted all tokens for user: {}", username);
//                tokenInvalidated = true;
//            }
//
//            if (tokenInvalidated) {
//                return "Logout successful";
//            } else {
//                return "No tokens were blacklisted during logout";
//            }
//
//        } catch (Exception e) {
//            log.error("Logout operation failed", e);
//            return "Logout failed: " + e.getMessage();
//        }
//    }
//
//    /**
//     * Helper method to generate token response for a new user
//     */
//    private TokenResponse generateTokenResponse(User user) {
//        Instant now = Instant.now();
//
//        // Access token expiry (1 hour)
//        long accessTokenExpiry = 3600L;
//
//        // Refresh token expiry (7 days)
//        long refreshTokenExpiry = 604800L;
//
//        // ID token expiry (1 hour)
//        long idTokenExpiry = 3600L;
//
//        String roles = user.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority)
//                .collect(Collectors.joining(" "));
//
//        // Generate access token with a unique ID
//        String accessTokenJti = UUID.randomUUID().toString();
//        JwtClaimsSet accessTokenClaims = JwtClaimsSet.builder()
//                .issuer("self")
//                .issuedAt(now)
//                .expiresAt(now.plusSeconds(accessTokenExpiry))
//                .subject(user.getUsername())
//                .claim("role", roles)
//                .claim("token_type", "access_token")
//                .claim("jti", accessTokenJti)
//                .build();
//
//        String accessToken = jwtEncoder.encode(JwtEncoderParameters.from(accessTokenClaims)).getTokenValue();
//
//        // Store the access token for this user
//        blacklistService.storeUserToken(user.getUsername(), accessToken);
//
//        // Generate refresh token with reference to the access token
//        JwtClaimsSet refreshTokenClaims = JwtClaimsSet.builder()
//                .issuer("self")
//                .issuedAt(now)
//                .expiresAt(now.plusSeconds(refreshTokenExpiry))
//                .subject(user.getUsername())
//                .claim("token_type", "refresh_token")
//                .claim("jti", UUID.randomUUID().toString())
//                .claim("associated_access_token", accessToken)
//                .build();
//
//        String refreshToken = jwtEncoder.encode(JwtEncoderParameters.from(refreshTokenClaims)).getTokenValue();
//
//        // Store the refresh token for this user
//        blacklistService.storeUserToken(user.getUsername(), refreshToken);
//
//        // Generate ID token with user-specific claims
//        JwtClaimsSet idTokenClaims = JwtClaimsSet.builder()
//                .issuer("self")
//                .issuedAt(now)
//                .expiresAt(now.plusSeconds(idTokenExpiry))
//                .subject(user.getUsername())
//                .claim("token_type", "id_token")
//                .claim("email", user.getEmail())
//                .claim("name", user.getUsername())
//                .claim("auth_time", now.getEpochSecond())
//                .build();
//
//        String idToken = jwtEncoder.encode(JwtEncoderParameters.from(idTokenClaims)).getTokenValue();
//
//        // Store the ID token for this user
//        blacklistService.storeUserToken(user.getUsername(), idToken);
//
//        log.info("Generated and stored tokens for newly registered user: {}", user.getUsername());
//
//        return new TokenResponse(accessToken, refreshToken, idToken);
//    }
//
//}