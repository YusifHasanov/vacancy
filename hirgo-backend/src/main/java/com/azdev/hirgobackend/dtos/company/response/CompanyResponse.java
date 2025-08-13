package com.azdev.hirgobackend.dtos.company.response;

import lombok.Builder;

@Builder
public record CompanyResponse(
        Long id,
        String name,
        String description,
        String location,
        String phoneNumber,
        String address) {}