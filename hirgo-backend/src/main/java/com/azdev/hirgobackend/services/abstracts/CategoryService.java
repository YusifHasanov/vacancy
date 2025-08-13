package com.azdev.hirgobackend.services.abstracts;

import com.azdev.hirgobackend.dtos.category.response.CategoryResponse;
import com.azdev.hirgobackend.dtos.category.response.CategoryListResponse;

public interface CategoryService {
    CategoryResponse getCategoryById(Long id);
    CategoryListResponse getAllCategories();
} 