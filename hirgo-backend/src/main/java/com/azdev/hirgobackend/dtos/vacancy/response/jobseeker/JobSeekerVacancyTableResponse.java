package com.azdev.hirgobackend.dtos.vacancy.response.jobseeker;

import java.sql.Timestamp;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobSeekerVacancyTableResponse {
    String id;
    String title;
    String companyName;
    String companyLogo;
    Timestamp postedAt;
    Long views;
    Boolean isNew;
}