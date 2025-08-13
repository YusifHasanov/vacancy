package com.azdev.hirgobackend.repositories;

import com.azdev.hirgobackend.dtos.vacancy.response.jobseeker.JobSeekerVacancyDetailsResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.jobseeker.JobSeekerVacancyTableResponse;
import com.azdev.hirgobackend.models.vacancy.Vacancy;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JobSeekerVacancyRepository extends JpaRepository<Vacancy, UUID> {

        @Query(value = """
                WITH language_skills_agg AS (
                   SELECT lsi.vacancy_id, json_agg(l.name) AS language_skills
                   FROM vacancy_language_skills_ids lsi
                   JOIN lookups l ON l.id = lsi.language_skills_ids
                   GROUP BY lsi.vacancy_id
                )
                SELECT
                    v.id AS id,
                    v.title AS title,
                    c.name AS company_name,
                    v.posted_at AS posted_at,
                    exp.name AS experience_level,
                    edu.name AS education_level,
                    v.salary AS salary,
                    v.application_deadline,
                    cat.name as category_name,
                    lsa.language_skills AS language_skills,
                    v.responsibilities,
                    v.education,
                    v.experience,
                    v.required_skills,
                    v.preferred_skills
                FROM vacancies v
                LEFT JOIN companies c ON c.id = v.company_id
                LEFT JOIN categories cat ON cat.id = v.category_id
                LEFT JOIN lookups exp ON exp.id = v.experience_level_id
                LEFT JOIN lookups edu ON edu.id = v.education_level_id
                LEFT JOIN language_skills_agg lsa ON lsa.vacancy_id = v.id
                WHERE v.id = :vacancyId
        """, nativeQuery = true)
        Optional<JobSeekerVacancyDetailsResponse> getVacancyDetailsById(@Param("vacancyId") String vacancyId);

        @Query(value = """
        SELECT
            v.id AS id,
            v.title AS title,
            c.name AS company_name,
            c.logo AS company_logo,
            v.posted_at AS posted_at,
            COALESCE(vv.view_count, 0) AS views,
            (CASE
                WHEN v.posted_at >= NOW() - INTERVAL '3 days' THEN true
                ELSE false
             END) AS is_new
        FROM vacancies v
        LEFT JOIN companies c ON v.company_id = c.id
        LEFT JOIN categories cat ON v.category_id = cat.id
        LEFT JOIN vacancy_views vv ON vv.vacancy_id = v.id
        """,
                countQuery = """
        SELECT COUNT(*) 
        FROM vacancies v
        LEFT JOIN companies c ON v.company_id = c.id
        LEFT JOIN categories cat ON v.category_id = cat.id
        LEFT JOIN vacancy_views vv ON vv.vacancy_id = v.id
        """,
                nativeQuery = true)
        Page<JobSeekerVacancyTableResponse> getAllVacanciesForTable(Pageable pageable);


        @Query(value = """
                  SELECT
                      v.id,
                      v.title,
                      c.name as companyName,
                      c.logo,
                      v.posted_at AS postedAt,
                      COALESCE(vv.view_count, 0) as views,
                      (CASE
                        WHEN v.posted_at >= NOW() - INTERVAL '3 days' THEN true
                        ELSE false
                      END) AS isNew
                  FROM vacancies v
                  JOIN companies c ON v.company_id = c.id
                  LEFT JOIN vacancy_views vv ON v.id = vv.vacancy_id
                  WHERE v.location_type_id = COALESCE(:locationTypeId, v.location_type_id)
                  AND v.category_id = COALESCE(:categoryId, v.category_id)
                  AND v.salary >= COALESCE(:minSalary, 0)
                  AND v.salary <= COALESCE(:maxSalary, 9223372036854775807)
                  AND v.employment_type_id = COALESCE(:employmentTypeId, v.employment_type_id)
                  AND v.work_schedule_id = COALESCE(:workScheduleId, v.work_schedule_id)
                  AND ((:postedTimeDate)::timestamp IS NULL OR v.posted_at >= (:postedTimeDate)::timestamp)
                """, 
                countQuery = """
                  SELECT COUNT(v.id)
                  FROM vacancies v
                  JOIN companies c ON v.company_id = c.id
                  LEFT JOIN vacancy_views vv ON v.id = vv.vacancy_id
                  WHERE v.location_type_id = COALESCE(:locationTypeId, v.location_type_id)
                  AND v.category_id = COALESCE(:categoryId, v.category_id)
                  AND v.salary >= COALESCE(:minSalary, 0)
                  AND v.salary <= COALESCE(:maxSalary, 9223372036854775807)
                  AND v.employment_type_id = COALESCE(:employmentTypeId, v.employment_type_id)
                  AND v.work_schedule_id = COALESCE(:workScheduleId, v.work_schedule_id)
                  AND ((:postedTimeDate)::timestamp IS NULL OR v.posted_at >= (:postedTimeDate)::timestamp)
                """,
                nativeQuery = true)
        Page<JobSeekerVacancyTableResponse> findVacanciesWithFilters(
                @Param("locationTypeId") Long locationTypeId,
                @Param("categoryId") Long categoryId,
                @Param("minSalary") Long minSalary,
                @Param("maxSalary") Long maxSalary,
                @Param("employmentTypeId") Long employmentTypeId,
                @Param("workScheduleId") Long workScheduleId,
                @Param("postedTimeDate") Timestamp postedTimeDate,
                Pageable pageable);



}