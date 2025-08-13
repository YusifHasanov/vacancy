package com.azdev.hirgobackend.dtos.vacancy.request;

import com.azdev.hirgobackend.enums.ExperienceLevel;
import com.azdev.hirgobackend.enums.Location;
import com.azdev.hirgobackend.enums.WorkSchedule;
import com.azdev.hirgobackend.models.vacancy.Description;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

@Builder
public record UpdateVacancyRequest(
        String title,
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
) {}