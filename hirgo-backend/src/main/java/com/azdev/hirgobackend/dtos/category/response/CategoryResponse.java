package com.azdev.hirgobackend.dtos.category.response;

import com.azdev.hirgobackend.enums.CategoryType;
import lombok.Builder;

@Builder
public record CategoryResponse(
    String id,
    String name
) {} 