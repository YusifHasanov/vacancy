package com.azdev.hirgobackend.repositories;

import com.azdev.hirgobackend.models.vacancy.VacancyView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VacancyViewRepository extends JpaRepository<VacancyView, String> {
    
    Optional<VacancyView> findByVacancyId(String vacancyId);
    
    @Modifying
    @Query(value = """
            INSERT INTO vacancy_views (vacancy_id, view_count)
            VALUES (:vacancyId, 1)
            ON CONFLICT (vacancy_id)
            DO UPDATE SET view_count = vacancy_views.view_count + 1
            """, nativeQuery = true)
    void incrementViewCount(@Param("vacancyId") String vacancyId);
} 