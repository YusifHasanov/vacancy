package com.azdev.hirgobackend.dtos.vacancy.response.company;

import com.azdev.hirgobackend.models.vacancy.Description;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

@Builder
public record VacancyCreateResponse(
        String id,
        String title,
        LocalDateTime postedAt,
        Long experienceLevelId,
        Long locationTypeId,
        Long salary,
        LocalDateTime applicationDeadline,
        Long categoryId,
        List<Long> languageSkillsIds,
        Long workScheduleId,
        Description description
) {
}