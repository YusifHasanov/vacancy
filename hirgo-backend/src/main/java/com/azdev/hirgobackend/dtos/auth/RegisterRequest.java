package com.azdev.hirgobackend.dtos.auth;

import com.azdev.hirgobackend.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @deprecated Use {@link CompanyRegisterRequest} or {@link ApplicantRegisterRequest} instead.
 * This class is kept for backward compatibility.
 */
@Deprecated
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @NotNull(message = "Role is required")
    private Role role;
    
    // Common fields for both Company and Applicant
    private String name; // Company name or Applicant fullName
    private String phone; // phoneNumber or phone
    
    // Company-specific fields
    private String description;
    private String logo;
    private String location;
    private String address;
    
    // Applicant-specific fields
    private String linkedInUrl;
    private String githubUrl;
    private String resumeUrl;
    private Integer experienceLevelId;
    private Integer educationLevelId;
    private Integer workScheduleId;
    private Integer expectedSalary;
} 