//package com.azdev.hirgobackend.controllers;
//
//import com.azdev.hirgobackend.dtos.auth.ApplicantRegisterRequest;
//import com.azdev.hirgobackend.dtos.auth.AuthResponse;
//import com.azdev.hirgobackend.dtos.auth.CompanyRegisterRequest;
//import com.azdev.hirgobackend.dtos.auth.LoginRequest;
//import com.azdev.hirgobackend.dtos.auth.RegisterRequest;
//import com.azdev.hirgobackend.dtos.auth.RefreshTokenRequest;
//import com.azdev.hirgobackend.dtos.auth.TokenIntrospectionResponse;
//import com.azdev.hirgobackend.dtos.auth.LogoutRequest;
//import com.azdev.hirgobackend.dtos.auth.LogoutResponse;
//import com.azdev.hirgobackend.services.AuthService;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/v1/auth")
//@RequiredArgsConstructor
//public class AuthController {
//
//    private final AuthService authService;
//
//    @PostMapping("/register/company")
//    public ResponseEntity<AuthResponse> registerCompany(@Valid @RequestBody CompanyRegisterRequest request) {
//        return ResponseEntity.ok(authService.registerCompany(request));
//    }
//
//    @PostMapping("/register/applicant")
//    public ResponseEntity<AuthResponse> registerApplicant(@Valid @RequestBody ApplicantRegisterRequest request) {
//        return ResponseEntity.ok(authService.registerApplicant(request));
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
//        return ResponseEntity.ok(authService.login(request));
//    }
//
//    @PostMapping("/refresh")
//    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
//        return ResponseEntity.ok(authService.refreshToken(request));
//    }
//
//    @PostMapping("/introspect")
//    public ResponseEntity<TokenIntrospectionResponse> introspectToken(@RequestParam String token) {
//        return ResponseEntity.ok(authService.introspectToken(token));
//    }
//
//    @PostMapping("/logout")
//    public ResponseEntity<LogoutResponse> logout(@Valid @RequestBody LogoutRequest request) {
//        return ResponseEntity.ok(authService.logout(request));
//    }
//}