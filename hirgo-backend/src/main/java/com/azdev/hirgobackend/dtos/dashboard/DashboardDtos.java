package com.azdev.hirgobackend.dtos.dashboard;

import java.time.LocalDateTime;
import java.util.List;

public class DashboardDtos {
    public record Metrics(
            long totalVacancies,
            long activeVacancies,
            long totalApplicants,
            long newApplicants
    ) {}

    public record RecentApplicant(
            Long id,
            String fullName,
            String email,
            LocalDateTime createdAt
    ) {}

    public record RecentVacancy(
            String id,
            String title,
            long applicants,
            String status
    ) {}

    public record DashboardResponse(
            Metrics metrics,
            List<RecentApplicant> recentApplicants,
            List<RecentVacancy> vacancyOverview
    ) {}
}


