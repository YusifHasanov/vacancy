package com.azdev.hirgobackend.dtos.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Request DTO for applicant registration.
 * Contains the required fields for creating a new applicant account.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicantRegisterRequest {
    /**
     * Email address of the applicant, must be unique in the system.
     * Will be used for login and communication.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    /**
     * Password for the applicant account.
     */
    @NotBlank(message = "Password is required")
    private String password;
    
    /**
     * First name of the applicant.
     */
    @NotBlank(message = "First name is required")
    private String firstName;
    
    /**
     * Last name of the applicant.
     */
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    /**
     * Date of birth of the applicant.
     * Must be in the past and in ISO format (yyyy-MM-dd).
     */
    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
    
    /**
     * Phone number of the applicant.
     */
    @NotBlank(message = "Phone number is required")
    private String phone;
} 