package com.azdev.hirgobackend.repositories;

import com.azdev.hirgobackend.models.company.Company;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    @Query("SELECT c FROM Company c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Company> searchByName(@Param("name") String name);
}