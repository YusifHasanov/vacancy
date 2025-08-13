package com.azdev.hirgobackend.repositories;

import com.azdev.hirgobackend.models.vacancy.VacancyViewLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VacancyViewLogRepository extends JpaRepository<VacancyViewLog, Long> {

    /**
     * Check if a view log exists for the given IP hash and vacancy ID
     * 
     * @param ipHash Hashed IP address
     * @param vacancyId Vacancy ID
     * @return true if a log entry exists
     */
    boolean existsByIpHashAndVacancyId(String ipHash, String vacancyId);
    
    /**
     * Find a view log by IP hash and vacancy ID
     * 
     * @param ipHash Hashed IP address
     * @param vacancyId Vacancy ID
     * @return Optional containing the log if found
     */
    Optional<VacancyViewLog> findByIpHashAndVacancyId(String ipHash, String vacancyId);
} 