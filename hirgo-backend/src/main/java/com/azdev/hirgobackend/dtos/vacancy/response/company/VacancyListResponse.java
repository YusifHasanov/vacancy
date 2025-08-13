package com.azdev.hirgobackend.dtos.vacancy.response.company;

import java.util.List;
import lombok.Builder;

@Builder
public record VacancyListResponse(
    List<VacancyResponse> vacancies
) {}