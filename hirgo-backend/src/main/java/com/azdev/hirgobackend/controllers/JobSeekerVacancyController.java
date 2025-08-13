package com.azdev.hirgobackend.controllers;

import com.azdev.hirgobackend.dtos.vacancy.request.JobSeekerVacancyFilterRequest;
import com.azdev.hirgobackend.dtos.vacancy.response.jobseeker.JobSeekerVacancyDetailsResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.jobseeker.JobSeekerVacancyTableResponse;
import com.azdev.hirgobackend.services.abstracts.JobSeekerVacancyService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/jobseeker/vacancies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class JobSeekerVacancyController {

    JobSeekerVacancyService jobSeekerVacancyService;

    @GetMapping("/{id}")
    public JobSeekerVacancyDetailsResponse getVacancyById(@PathVariable String id) {
        return jobSeekerVacancyService.getVacancyByIdForDetails(id);
    }

    @GetMapping
    public Page<JobSeekerVacancyTableResponse> getAllVacancies(Pageable pageable) {
        return jobSeekerVacancyService.getAllVacanciesForTable(pageable);
    }

    @PostMapping("/filter")
    public Page<JobSeekerVacancyTableResponse> getAllVacanciesByFilter(@RequestBody JobSeekerVacancyFilterRequest filterRequest, Pageable pageable) {
        return jobSeekerVacancyService.getAllVacanciesByFilter(filterRequest, pageable);
    }

}