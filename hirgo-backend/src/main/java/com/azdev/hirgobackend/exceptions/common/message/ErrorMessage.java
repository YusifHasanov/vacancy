package com.azdev.hirgobackend.exceptions.common.message;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

@Getter
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorMessage {
    // Vacancy related error messages
    VACANCY_NOT_FOUND("Vacancy not found with id: %s"),
    VACANCY_ALREADY_EXISTS("Vacancy already exists with id: %s"),
    VACANCY_INVALID_DATE("Application deadline cannot be in the past"),
    VACANCY_INVALID_SALARY("Salary must be greater than zero"),
    VACANCY_NOT_OWNED("You don't have permission to access vacancy with id: %s"),
    
    // Category related error messages
    CATEGORY_NOT_FOUND("Category not found with id: %s"),
    CATEGORY_ALREADY_EXISTS("Category already exists with name: %s"),

    // Company related error messages
    COMPANY_NOT_FOUND("Company not found with id: %s"),
    COMPANY_ALREADY_EXISTS("Company already exists with name: %s"),

    // Lookup related error messages
    LOOKUP_NOT_FOUND("Lookup not found with id: %s"),

    // General error messages
    INVALID_REQUEST("Invalid request: %s"),
    UNAUTHORIZED("Unauthorized access"),
    FORBIDDEN("Access forbidden"),
    INTERNAL_SERVER_ERROR("Internal server error occurred");



    String message;
} 