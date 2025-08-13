package com.azdev.hirgobackend.controllers;

import com.azdev.hirgobackend.dtos.company.request.CreateCompanyRequest;
import com.azdev.hirgobackend.dtos.company.request.UpdateCompanyRequest;
import com.azdev.hirgobackend.dtos.company.response.CompanyResponse;
import com.azdev.hirgobackend.services.abstracts.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.security.SecuritySchemes;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/companies")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Log4j2
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Company Management", description = "Endpoints for managing companies")
public class CompanyController {

    CompanyService companyService;

    @Operation(summary = "Get Company by ID", description = "Retrieve company details by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getCompanyById(@PathVariable Long id) {
        CompanyResponse response = companyService.getCompanyById(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get All Companies", description = "Retrieve a list of all companies")
    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getAllCompanies() {
        List<CompanyResponse> response = companyService.getAllCompanies();
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Search Companies", description = "Search companies by name")
    @GetMapping("/search")
    public ResponseEntity<List<CompanyResponse>> searchCompaniesByName(@RequestParam String name) {
        List<CompanyResponse> response = companyService.searchCompaniesByName(name);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Create a Company", description = "Create a new company",
            security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(@RequestBody CreateCompanyRequest request) {
        CompanyResponse response = companyService.createCompany(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Update a Company", description = "Update company details by ID",
            security = @SecurityRequirement(name = "bearerAuth"))
    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> updateCompany(
            @PathVariable Long id,
            @RequestBody UpdateCompanyRequest request) {
        CompanyResponse response = companyService.updateCompany(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete a Company", description = "Delete a company by ID",
            security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }

}