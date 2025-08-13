package com.azdev.hirgobackend.services.abstracts;

import com.azdev.hirgobackend.dtos.vacancy.request.CreateVacancyRequest;
import com.azdev.hirgobackend.dtos.vacancy.request.UpdateVacancyRequest;
import com.azdev.hirgobackend.dtos.vacancy.request.VacancyFilterRequest;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyCompanyListResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyCreateResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyListResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VacancyService {
    VacancyCreateResponse createVacancy(CreateVacancyRequest request);

    VacancyResponse getVacancyById(String id);

    VacancyListResponse getAllVacancies();

    VacancyCompanyListResponse getCompanyVacancies();

    Page<VacancyResponse> filterVacancies(VacancyFilterRequest filter, Pageable pageable);

    VacancyResponse updateVacancy(String id, UpdateVacancyRequest request);

    void deleteVacancy(String id);
}
