package com.azdev.hirgobackend.repositories;

import com.azdev.hirgobackend.models.resume.Resume;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserId(UUID userId);

    Optional<Resume> findByIdAndUserId(Long id, UUID userId);
}
