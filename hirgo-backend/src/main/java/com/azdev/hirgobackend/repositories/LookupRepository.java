package com.azdev.hirgobackend.repositories;

import com.azdev.hirgobackend.models.lookup.Lookup;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LookupRepository extends JpaRepository<Lookup, Long> {
    Lookup findByIdAndType(Long id, String type);

    List<Lookup> findAllByType(String type);
}