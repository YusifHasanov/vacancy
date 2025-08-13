package com.azdev.hirgobackend.dtos.vacancy.response.company;

import com.azdev.hirgobackend.models.vacancy.Description;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VacancyCompanyResponse {
    String id;
    String title;
    LocalDateTime postedAt;
    Long experienceLevelId;
    Long locationTypeId;
    Long salary;
    LocalDateTime applicationDeadline;
    String categoryName;
    Long categoryId;
    List<Long> languageSkillsIds;
    Long workScheduleId;
    Description description;

}
