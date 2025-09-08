package com.azdev.hirgobackend.services.concretes;

import com.azdev.hirgobackend.dtos.dashboard.DashboardDtos.DashboardResponse;
import com.azdev.hirgobackend.dtos.dashboard.DashboardDtos.Metrics;
import com.azdev.hirgobackend.dtos.dashboard.DashboardDtos.RecentApplicant;
import com.azdev.hirgobackend.dtos.dashboard.DashboardDtos.RecentVacancy;
import com.azdev.hirgobackend.models.applicant.Applicant;
import com.azdev.hirgobackend.models.vacancy.Vacancy;
import com.azdev.hirgobackend.repositories.ApplicantRepository;
import com.azdev.hirgobackend.repositories.VacancyRepository;
import com.azdev.hirgobackend.security.service.CurrentUserService;
import com.azdev.hirgobackend.services.abstracts.DashboardService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final VacancyRepository vacancyRepository;
    private final ApplicantRepository applicantRepository;
    private final CurrentUserService currentUserService;

    @Override
    public DashboardResponse getCompanyDashboard() {
        Long companyId = currentUserService.getCurrentCompanyId();

        long totalVacancies = vacancyRepository.countByCompanyId(companyId);
        long activeVacancies = vacancyRepository.countByCompanyIdAndApplicationDeadlineAfter(companyId, LocalDateTime.now());

        long totalApplicants = applicantRepository.count();
        long newApplicants = applicantRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(7));

        Metrics metrics = new Metrics(
                totalVacancies,
                activeVacancies,
                totalApplicants,
                newApplicants
        );

        List<RecentApplicant> recentApplicants = applicantRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(a -> new RecentApplicant(
                        a.getId(),
                        a.getFirstName() + " " + a.getLastName(),
                        a.getEmail(),
                        a.getCreatedAt()
                ))
                .collect(Collectors.toList());

        List<Vacancy> latestVacancies = vacancyRepository.findTop10ByCompanyIdOrderByPostedAtDesc(companyId);
        List<RecentVacancy> vacancyOverview = latestVacancies.stream()
                .map(v -> new RecentVacancy(
                        v.getId(),
                        v.getTitle(),
                        0L,
                        v.getApplicationDeadline() != null && v.getApplicationDeadline().isAfter(LocalDateTime.now()) ? "Active" : "Draft"
                ))
                .collect(Collectors.toList());

        return new DashboardResponse(metrics, recentApplicants, vacancyOverview);
    }
}


