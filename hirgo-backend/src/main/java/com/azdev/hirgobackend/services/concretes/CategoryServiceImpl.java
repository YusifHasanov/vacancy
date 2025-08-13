package com.azdev.hirgobackend.services.concretes;

import com.azdev.hirgobackend.dtos.category.response.CategoryResponse;
import com.azdev.hirgobackend.dtos.category.response.CategoryListResponse;
import com.azdev.hirgobackend.exceptions.domain.category.CategoryNotFoundException;
import com.azdev.hirgobackend.mappers.CategoryMapper;
import com.azdev.hirgobackend.models.category.Category;
import com.azdev.hirgobackend.repositories.CategoryRepository;
import com.azdev.hirgobackend.services.abstracts.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryServiceImpl implements CategoryService {
    
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new CategoryNotFoundException(id));
        return categoryMapper.toResponse(category);
    }

    @Override
    public CategoryListResponse getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryResponse> categoryResponses = categoryMapper.toResponseList(categories);
        return new CategoryListResponse(categoryResponses);
    }

} 