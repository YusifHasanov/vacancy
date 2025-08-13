package com.azdev.hirgobackend.repositories;

import com.azdev.hirgobackend.models.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
} 