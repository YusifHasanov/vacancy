package com.azdev.hirgobackend.dtos.category.response;

import java.util.List;
import lombok.Builder;

@Builder
public record CategoryListResponse(
    List<CategoryResponse> categories
) {} 