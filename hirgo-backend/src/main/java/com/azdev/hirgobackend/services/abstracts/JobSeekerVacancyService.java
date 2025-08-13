package com.azdev.hirgobackend.services.abstracts;

import com.azdev.hirgobackend.dtos.vacancy.request.JobSeekerVacancyFilterRequest;
import com.azdev.hirgobackend.dtos.vacancy.request.VacancyFilterRequest;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.jobseeker.JobSeekerVacancyDetailsResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.jobseeker.JobSeekerVacancyTableResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobSeekerVacancyService {
    JobSeekerVacancyDetailsResponse getVacancyByIdForDetails(String id);

    Page<JobSeekerVacancyTableResponse> getAllVacanciesForTable(Pageable pageable);

    Page<JobSeekerVacancyTableResponse> getAllVacanciesByFilter(JobSeekerVacancyFilterRequest filter, Pageable pageable);
}