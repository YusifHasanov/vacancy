package com.azdev.hirgobackend.dtos.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for company registration.
 * Contains the required fields for creating a new company account.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanyRegisterRequest {
    /**
     * Email address of the company, must be unique in the system.
     * Will be used for login and communication.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    /**
     * Password for the company account.
     */
    @NotBlank(message = "Password is required")
    private String password;
    
    /**
     * Name of the company.
     */
    @NotBlank(message = "Company name is required")
    private String name;
    
    /**
     * Contact phone number for the company.
     */
    @NotBlank(message = "Phone number is required")
    private String phone;
} 