package com.azdev.hirgobackend.dtos.vacancy.request;

import java.time.LocalDateTime;
import java.util.List;

public record VacancyFilterRequest(
        Long locationTypeId,
        List<Long> categoryIds,
        Long employmentTypeId,
        Long workScheduleId,
        Long minSalary,
        Long maxSalary,
        LocalDateTime postedAfter,
        LocalDateTime postedBefore
) {}