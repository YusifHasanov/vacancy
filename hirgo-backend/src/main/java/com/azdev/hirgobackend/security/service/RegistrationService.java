package com.azdev.hirgobackend.security.service;

import com.azdev.hirgobackend.dtos.auth.ApplicantRegisterRequest;
import com.azdev.hirgobackend.dtos.auth.CompanyRegisterRequest;
import com.azdev.hirgobackend.enums.Role;
import com.azdev.hirgobackend.models.applicant.Applicant;
import com.azdev.hirgobackend.models.company.Company;
import com.azdev.hirgobackend.models.user.User;
import com.azdev.hirgobackend.repositories.ApplicantRepository;
import com.azdev.hirgobackend.repositories.CompanyRepository;
import com.azdev.hirgobackend.security.dto.TokenResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service for handling user registration (companies and applicants)
 */
@Service
public class RegistrationService {
    
    private static final Logger log = LogManager.getLogger(RegistrationService.class);
    private final UserService userService;
    private final CompanyRepository companyRepository;
    private final ApplicantRepository applicantRepository;
    private final TokenService tokenService;
    
    public RegistrationService(UserService userService,
                              CompanyRepository companyRepository,
                              ApplicantRepository applicantRepository,
                              TokenService tokenService) {
        this.userService = userService;
        this.companyRepository = companyRepository;
        this.applicantRepository = applicantRepository;
        this.tokenService = tokenService;
        log.info("RegistrationService initialized");
    }
    
    /**
     * Register a new company account
     * 
     * @param request Company registration data
     * @return Authentication tokens
     */
    @Transactional
    public TokenResponse registerCompany(CompanyRegisterRequest request) {
        try {
            // Check if email already exists
            if (userService.existsByEmail(request.getEmail())) {
                log.warn("Company registration failed: Email {} already exists", request.getEmail());
                throw new RuntimeException("Email already exists");
            }

            // Create company profile with required fields
            Company company = new Company();
            company.setName(request.getName());
            company.setPhoneNumber(request.getPhone());
            
            company = companyRepository.save(company);
            Long profileId = company.getId();
            
            // Create user with company role
            User user = userService.createUser(
                    request.getEmail(), 
                    request.getPassword(),
                    Role.ROLE_COMPANY,
                    profileId
            );
            
            log.info("Company with email {} has been registered successfully", request.getEmail());
            
            // Generate tokens for authentication
            return tokenService.generateTokens(user);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error during company registration: {}", e.getMessage(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Register a new applicant account
     * 
     * @param request Applicant registration data
     * @return Authentication tokens
     */
    @Transactional
    public TokenResponse registerApplicant(ApplicantRegisterRequest request) {
        try {
            // Check if email already exists
            if (userService.existsByEmail(request.getEmail())) {
                log.warn("Applicant registration failed: Email {} already exists", request.getEmail());
                throw new RuntimeException("Email already exists");
            }

            // Create applicant profile with required fields
            Applicant applicant = new Applicant();
            applicant.setFirstName(request.getFirstName());
            applicant.setLastName(request.getLastName());
            applicant.setEmail(request.getEmail());
            applicant.setDateOfBirth(request.getDateOfBirth());
            applicant.setPhone(request.getPhone());
            applicant.setCreatedAt(LocalDateTime.now());
            applicant.setUpdatedAt(LocalDateTime.now());
            
            applicant = applicantRepository.save(applicant);
            Long profileId = applicant.getId();
            
            // Create user with applicant role
            User user = userService.createUser(
                    request.getEmail(),
                    request.getPassword(),
                    Role.ROLE_APPLICANT,
                    profileId
            );
            
            log.info("Applicant with email {} has been registered successfully", request.getEmail());
            
            // Generate tokens for authentication
            return tokenService.generateTokens(user);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error during applicant registration: {}", e.getMessage(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }
} 