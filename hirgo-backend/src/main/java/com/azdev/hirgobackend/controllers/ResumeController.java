package com.azdev.hirgobackend.controllers;

import com.azdev.hirgobackend.dtos.resume.ResumeCreateRequest;
import com.azdev.hirgobackend.dtos.resume.ResumeResponse;
import com.azdev.hirgobackend.dtos.resume.ResumeUpdateRequest;
import com.azdev.hirgobackend.services.concretes.ResumeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping
    public ResponseEntity<ResumeResponse> createResume(
            @Valid @RequestBody ResumeCreateRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        UUID userId = UUID.fromString(jwt.getSubject());

        ResumeResponse createdResume = resumeService.upsertResumeForUser(request, userId);
        return new ResponseEntity<>(createdResume, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getAllMyResumes(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        List<ResumeResponse> resumes = resumeService.getAllResumesForUser(userId);
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeResponse> getResumeById(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        UUID userId = UUID.fromString(jwt.getSubject());
        ResumeResponse resume = resumeService.getResumeByIdForUser(id, userId);
        return ResponseEntity.ok(resume);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResumeResponse> updateResume(
            @PathVariable Long id,
            @RequestBody ResumeUpdateRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        UUID userId = UUID.fromString(jwt.getSubject());
        ResumeResponse updatedResume = resumeService.updateResume(id, request, userId);
        return ResponseEntity.ok(updatedResume);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        UUID userId = UUID.fromString(jwt.getSubject());
        resumeService.deleteResume(id, userId);
        return ResponseEntity.noContent().build();
    }
}