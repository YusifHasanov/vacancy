package com.azdev.hirgobackend.controllers;

import com.azdev.hirgobackend.dtos.lookup.LookupResponse;
import com.azdev.hirgobackend.services.abstracts.LookupService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/api/v1/lookups")
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@Log4j2
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Lookup Management", description = "APIs to retrieve lookup values for different types")
public class LookupController {

    LookupService lookupService;

    @Operation(
        summary = "Retrieve a lookup by ID",
        description = "Fetches a specific lookup value based on its ID. Optionally filters by type."
    )
    @GetMapping
    public ResponseEntity<LookupResponse> getLookup(
            @Parameter(description = "ID of the lookup value to retrieve", required = true)
            @RequestParam Long id,
            @Parameter(description = "Optional filter for lookup type (EducationLevel, EmploymentType, ExperienceLevel, LanguageSkills, Location, WorkSchedule)")
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(lookupService.lookup(id, type));
    }

    @Operation(
        summary = "Retrieve all lookup values of a specific type",
        description = "Fetches all lookup values belonging to a given type. Available types: EducationLevel, EmploymentType, ExperienceLevel, LanguageSkills, Location, WorkSchedule."
    )
    @GetMapping("/all")
    public ResponseEntity<List<LookupResponse>> getLookups(
            @Parameter(description = "Type of lookup values to retrieve (EducationLevel, EmploymentType, ExperienceLevel, LanguageSkills, Location, WorkSchedule)", required = true)
            @RequestParam String type) {
        return ResponseEntity.ok(lookupService.lookupAllByType(type));
    }
}