package com.azdev.hirgobackend.models.vacancy;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Table(name = "vacancies")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Vacancy {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String title;
    Long companyId;
    // Integer views; will be in the dto and will retrieve from the cache
    LocalDateTime postedAt;
    // Boolean isFavorite; will be in the dto and will retrieve from the second table with join query
    Long experienceLevelId;
    Long locationTypeId;
    Long employmentTypeId;
    Long educationLevelId;
    @ElementCollection
    List<Long> languageSkillsIds;
    Long workScheduleId;
    Long salary;
    LocalDateTime applicationDeadline;
    Long categoryId;
    @Embedded
    Description description;
}