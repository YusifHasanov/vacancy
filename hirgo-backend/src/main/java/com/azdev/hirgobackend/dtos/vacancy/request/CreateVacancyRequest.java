package com.azdev.hirgobackend.dtos.vacancy.request;

import com.azdev.hirgobackend.enums.ExperienceLevel;
import com.azdev.hirgobackend.enums.Location;
import com.azdev.hirgobackend.enums.WorkSchedule;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record CreateVacancyRequest(
        String title,
        Long experienceLevelId,
        Long locationTypeId,
        Long employmentTypeId,
        Long educationLevelId,
        List<Long> languageSkillsIds,
        Long workScheduleId,
        Long salary,
        LocalDateTime applicationDeadline,
        Long categoryId,
        VacancyDescription description
) {
    @Builder
    public record VacancyDescription(
            String[] responsibilities,
            String[] education,
            String[] experience,
            String[] requiredSkills,
            String[] preferredSkills
    ) {}
}