package com.azdev.hirgobackend.mappers;

import com.azdev.hirgobackend.dtos.company.request.CreateCompanyRequest;
import com.azdev.hirgobackend.dtos.company.request.UpdateCompanyRequest;
import com.azdev.hirgobackend.dtos.company.response.CompanyResponse;
import com.azdev.hirgobackend.models.company.Company;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedSourcePolicy = ReportingPolicy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CompanyMapper {
    CompanyResponse toResponse(Company company);

    Company toEntity(CompanyResponse response);

    List<CompanyResponse> toResponseList(List<Company> companies);

    Company createCompanyRequestToEntity(CreateCompanyRequest createCompanyRequest);

    void updateCompanyRequestToEntity(@MappingTarget Company company, UpdateCompanyRequest updateCompanyRequest);
}