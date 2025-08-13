package com.azdev.hirgobackend.mappers;

import com.azdev.hirgobackend.dtos.category.response.CategoryResponse;
import com.azdev.hirgobackend.models.category.Category;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import java.util.List;

@Mapper(componentModel = "spring",
        unmappedSourcePolicy = ReportingPolicy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {
    CategoryResponse toResponse(Category category);

    List<CategoryResponse> toResponseList(List<Category> categories);
} 