package com.azdev.hirgobackend.controllers;

import com.azdev.hirgobackend.dtos.dashboard.DashboardDtos.DashboardResponse;
import com.azdev.hirgobackend.services.abstracts.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/company")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<DashboardResponse> getCompanyDashboard() {
        return ResponseEntity.ok(dashboardService.getCompanyDashboard());
    }
}


