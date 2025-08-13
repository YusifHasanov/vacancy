package com.azdev.hirgobackend.dtos.vacancy.request;

import com.azdev.hirgobackend.enums.PostedTime;

public record JobSeekerVacancyFilterRequest(
        Long locationTypeId,
        Long categoryId,
        Long employmentTypeId,
        Long workScheduleId,
        Long minSalary,
        Long maxSalary,
        PostedTime postedTime) {}