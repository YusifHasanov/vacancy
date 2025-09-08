package com.azdev.hirgobackend.repositories;

import com.azdev.hirgobackend.models.vacancy.Vacancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.repository.query.Param;

public interface VacancyRepository extends JpaRepository<Vacancy, String>, QuerydslPredicateExecutor<Vacancy> {
    long countByCompanyId(Long companyId);

    long countByCompanyIdAndApplicationDeadlineAfter(Long companyId, LocalDateTime now);

    List<Vacancy> findTop10ByCompanyIdOrderByPostedAtDesc(Long companyId);
}