package com.azdev.hirgobackend.models.applicant;

import com.azdev.hirgobackend.util.IntegerListConverter;
import com.azdev.hirgobackend.util.LongListConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Entity
@Table(name = "applicants")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Applicant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String firstName;
    String lastName;
    String email;
    String phone;
    String profilePictureUrl;
    LocalDate dateOfBirth;
    String linkedInUrl;
    String githubUrl;
    String resumeUrl;
    Integer experienceLevelId;
    Integer educationLevelId;
    @Convert(converter = IntegerListConverter.class)
    List<Integer> languageSkillsIds;
    Integer workScheduleId;
    Integer expectedSalary;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}