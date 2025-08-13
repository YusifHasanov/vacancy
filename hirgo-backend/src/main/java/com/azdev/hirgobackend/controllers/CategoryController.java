package com.azdev.hirgobackend.controllers;

import com.azdev.hirgobackend.dtos.category.response.CategoryResponse;
import com.azdev.hirgobackend.dtos.category.response.CategoryListResponse;
import com.azdev.hirgobackend.services.abstracts.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    
    CategoryService categoryService;


    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        CategoryResponse response = categoryService.getCategoryById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<CategoryListResponse> getAllCategories() {
        CategoryListResponse response = categoryService.getAllCategories();
        return ResponseEntity.ok(response);
    }

} 