package com.azdev.hirgobackend.dtos.vacancy.response.jobseeker;

import com.azdev.hirgobackend.models.vacancy.Description;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.sql.Timestamp;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobSeekerVacancyDetailsResponse {
    String id;
    String title;
    String companyName;
    Timestamp postedAt;
    String experienceLevel;
    String educationLevel;
    Long salary;
    Timestamp applicationDeadline;
    String categoryName;
    @JsonIgnore
    String languageSkills;
    Description description;

    public JobSeekerVacancyDetailsResponse(String id,
                                           String title,
                                           String companyName,
                                           Timestamp postedAt,
                                           String experienceLevel,
                                           String educationLevel,
                                           Long salary,
                                           Timestamp applicationDeadline,
                                           String categoryName,
                                           String languageSkills,
                                           String[] responsibilities,
                                           String[] education,
                                           String[] experience,
                                           String[] requiredSkills,
                                           String[] preferredSkills) {
        this.id = id;
        this.title = title;
        this.companyName = companyName;
        this.postedAt = postedAt;
        this.experienceLevel = experienceLevel;
        this.educationLevel = educationLevel;
        this.salary = salary;
        this.applicationDeadline = applicationDeadline;
        this.categoryName = categoryName;
        this.languageSkills = languageSkills;
        this.description = Description.builder()
                                        .responsibilities(responsibilities)
                                        .education(education)
                                        .experience(experience)
                                        .preferredSkills(preferredSkills)
                                        .requiredSkills(requiredSkills)
                                        .build();
    }

    @JsonProperty("languageSkills")
    public List<String> getLanguageSkills() throws JsonProcessingException {
        if (languageSkills == null) return List.of();
        return new ObjectMapper().readValue(languageSkills, new TypeReference<>() {});
    }

}