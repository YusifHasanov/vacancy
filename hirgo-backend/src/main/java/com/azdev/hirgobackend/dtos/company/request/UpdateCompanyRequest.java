package com.azdev.hirgobackend.dtos.company.request;

import lombok.Builder;

@Builder
public record UpdateCompanyRequest(
        String name,
        String logo,
        String location,
        String phoneNumber,
        String address
) {}