package com.azdev.hirgobackend.dtos.vacancy.response.company;

import com.azdev.hirgobackend.models.vacancy.Description;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

public record VacancyResponse(
        String id,
        String title,
        LocalDateTime postedAt,
        Long employmentTypeId,
        Long experienceLevelId,
        Long educationLevelId,
        Long locationTypeId,
        Long salary,
        LocalDateTime applicationDeadline,
        Long categoryId,
        List<Long> languageSkillsIds,
        Long workScheduleId,
        Description description
) {
}