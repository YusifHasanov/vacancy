package com.azdev.hirgobackend.mappers;

import com.azdev.hirgobackend.dtos.vacancy.request.CreateVacancyRequest;
import com.azdev.hirgobackend.dtos.vacancy.request.UpdateVacancyRequest;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyCompanyResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyCreateResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyResponse;
import com.azdev.hirgobackend.models.vacancy.Vacancy;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;


@Mapper(componentModel = "spring",
        unmappedSourcePolicy = ReportingPolicy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VacancyMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "postedAt", expression = "java(java.time.LocalDateTime.now())")
    Vacancy toEntity(CreateVacancyRequest request);

    VacancyResponse toResponse(Vacancy vacancy);

    VacancyCompanyResponse toCompanyResponse(Vacancy vacancy);

    VacancyCreateResponse toCreateResponse(Vacancy vacancy);


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "postedAt", ignore = true)
    void updateVacancyFromDto(UpdateVacancyRequest request, @MappingTarget Vacancy vacancy);

    List<VacancyResponse> toResponseList(List<Vacancy> vacancies);

    List<VacancyCompanyResponse> toCompanyResponseList(List<Vacancy> vacancies);

    default org.springframework.data.domain.Page<VacancyResponse> toResponsePage(org.springframework.data.domain.Page<Vacancy> vacancies) {
        return vacancies.map(this::toResponse);
    }

}