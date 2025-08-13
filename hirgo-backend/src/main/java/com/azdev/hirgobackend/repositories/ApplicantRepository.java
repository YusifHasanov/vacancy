package com.azdev.hirgobackend.repositories;

import com.azdev.hirgobackend.models.applicant.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, Long> {
    Optional<Applicant> findByEmail(String email);
    boolean existsByEmail(String email);
} 