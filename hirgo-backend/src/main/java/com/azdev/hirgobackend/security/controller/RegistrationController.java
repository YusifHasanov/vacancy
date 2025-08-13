package com.azdev.hirgobackend.security.controller;

import com.azdev.hirgobackend.dtos.auth.ApplicantRegisterRequest;
import com.azdev.hirgobackend.dtos.auth.CompanyRegisterRequest;
import com.azdev.hirgobackend.security.dto.TokenResponse;
import com.azdev.hirgobackend.security.service.RegistrationService;
import jakarta.validation.Valid;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for handling user registration (companies and applicants)
 */
@RestController
@RequestMapping("/api/auth/register")
@CrossOrigin(allowedHeaders = "*", origins = "*")
public class RegistrationController {
    
    private static final Logger log = LogManager.getLogger(RegistrationController.class);
    private final RegistrationService registrationService;
    
    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
        log.info("RegistrationController initialized");
    }
    
    /**
     * Register a new company account
     * 
     * @param request Company registration data
     * @return Authentication tokens
     */
    @PostMapping("/company")
    public ResponseEntity<TokenResponse> registerCompany(@Valid @RequestBody CompanyRegisterRequest request) {
        TokenResponse tokens = registrationService.registerCompany(request);
        return ResponseEntity.ok(tokens);
    }
    
    /**
     * Register a new applicant account
     * 
     * @param request Applicant registration data
     * @return Authentication tokens
     */
    @PostMapping("/applicant")
    public ResponseEntity<TokenResponse> registerApplicant(@Valid @RequestBody ApplicantRegisterRequest request) {
        TokenResponse tokens = registrationService.registerApplicant(request);
        return ResponseEntity.ok(tokens);
    }
} 