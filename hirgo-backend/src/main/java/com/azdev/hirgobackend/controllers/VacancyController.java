package com.azdev.hirgobackend.controllers;

import com.azdev.hirgobackend.dtos.vacancy.request.VacancyFilterRequest;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyCompanyListResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyCreateResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.azdev.hirgobackend.dtos.vacancy.request.CreateVacancyRequest;
import com.azdev.hirgobackend.dtos.vacancy.request.UpdateVacancyRequest;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyListResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyResponse;
import com.azdev.hirgobackend.services.abstracts.VacancyService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/v1/vacancies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VacancyController {
    
    VacancyService vacancyService;

    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Create a new vacancy", description = "Creates a new vacancy and returns the created vacancy details.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Vacancy created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping
    public ResponseEntity<VacancyCreateResponse> createVacancy(@RequestBody CreateVacancyRequest request) {
        VacancyCreateResponse response = vacancyService.createVacancy(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Get vacancy by ID", description = "Retrieves a vacancy by its ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vacancy found"),
        @ApiResponse(responseCode = "404", description = "Vacancy not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<VacancyResponse> getVacancyById(@PathVariable String id) {
        VacancyResponse response = vacancyService.getVacancyById(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get all vacancies", description = "Retrieves a list of all vacancies for public display.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of vacancies retrieved successfully")
    })
    @GetMapping
    public ResponseEntity<VacancyListResponse> getAllVacancies() {
        VacancyListResponse response = vacancyService.getAllVacancies();
        return ResponseEntity.ok(response);
    }
    
    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Get company vacancies", description = "Retrieves all vacancies belonging to the authenticated company.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Company's vacancies retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied - requires company role")
    })
    @GetMapping("/company")
    public ResponseEntity<VacancyCompanyListResponse> getCompanyVacancies() {
        VacancyCompanyListResponse response = vacancyService.getCompanyVacancies();
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Update a vacancy", description = "Updates an existing vacancy by its ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vacancy updated successfully"),
        @ApiResponse(responseCode = "404", description = "Vacancy not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "403", description = "Unauthorized - you don't own this vacancy")
    })
    @PutMapping("/{id}")
    public ResponseEntity<VacancyResponse> updateVacancy(@PathVariable String id,
                                                         @RequestBody UpdateVacancyRequest request) {
        VacancyResponse response = vacancyService.updateVacancy(id, request);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Delete a vacancy", description = "Deletes a vacancy by its ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Vacancy deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Vacancy not found"),
        @ApiResponse(responseCode = "403", description = "Unauthorized - you don't own this vacancy")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVacancy(@PathVariable String id) {
        vacancyService.deleteVacancy(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Filter vacancies", description = "Filters vacancies based on the provided criteria.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Filtered vacancies retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid filter criteria")
    })
    @PostMapping("/filter")
    public ResponseEntity<Page<VacancyResponse>> filterVacancies(
            @RequestBody VacancyFilterRequest filter, Pageable pageable) {
        Page<VacancyResponse> response = vacancyService.filterVacancies(filter, pageable);
        return ResponseEntity.ok(response);
    }

}
