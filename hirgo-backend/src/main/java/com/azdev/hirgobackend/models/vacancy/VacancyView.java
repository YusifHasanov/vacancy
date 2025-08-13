package com.azdev.hirgobackend.models.vacancy;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vacancy_views")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VacancyView {
    @Id
    String vacancyId;

    @Column(nullable = false)
    Long viewCount = 0L;
}