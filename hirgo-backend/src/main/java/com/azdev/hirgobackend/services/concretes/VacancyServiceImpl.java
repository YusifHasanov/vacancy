package com.azdev.hirgobackend.services.concretes;

import com.azdev.hirgobackend.dtos.vacancy.request.CreateVacancyRequest;
import com.azdev.hirgobackend.dtos.vacancy.request.UpdateVacancyRequest;
import com.azdev.hirgobackend.dtos.vacancy.request.VacancyFilterRequest;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyCompanyListResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyCompanyResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyCreateResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyListResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.company.VacancyResponse;
import com.azdev.hirgobackend.exceptions.domain.vacancy.VacancyNotFoundException;
import com.azdev.hirgobackend.exceptions.domain.vacancy.VacancyNotOwnedException;
import com.azdev.hirgobackend.mappers.VacancyMapper;
import com.azdev.hirgobackend.models.category.QCategory;
import com.azdev.hirgobackend.models.vacancy.QVacancy;
import com.azdev.hirgobackend.models.vacancy.Vacancy;
import com.azdev.hirgobackend.repositories.VacancyRepository;
import com.azdev.hirgobackend.security.service.CurrentUserService;
import com.azdev.hirgobackend.services.abstracts.VacancyService;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VacancyServiceImpl implements VacancyService {

    VacancyRepository vacancyRepository;
    VacancyMapper vacancyMapper;
    JPAQueryFactory jpaQueryFactory;
    CurrentUserService currentUserService;

    @Override
    public VacancyCreateResponse createVacancy(CreateVacancyRequest request) {
        // Get the vacancy from the request
        Vacancy vacancy = vacancyMapper.toEntity(request);

        // Set the company ID from the authenticated user's token
        Long companyId = currentUserService.getCurrentCompanyId();
        vacancy.setCompanyId(companyId);

        // Save the vacancy
        Vacancy savedVacancy = vacancyRepository.save(vacancy);
        return vacancyMapper.toCreateResponse(savedVacancy);
    }

    @Override
    public VacancyResponse getVacancyById(String id) {
        Vacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new VacancyNotFoundException(id));
        return vacancyMapper.toResponse(vacancy);
    }

    @Override
    public VacancyListResponse getAllVacancies() {
        List<Vacancy> vacancies = vacancyRepository.findAll();
        List<VacancyResponse> vacancyResponses = vacancyMapper.toResponseList(vacancies);
        return new VacancyListResponse(vacancyResponses);
    }

    @Override
    public VacancyCompanyListResponse getCompanyVacancies() {
        Long companyId = currentUserService.getCurrentCompanyId();

        QVacancy vacancy = QVacancy.vacancy;
        QCategory category = QCategory.category;

        List<Tuple> rows = jpaQueryFactory
                .select(vacancy, category.name.stringValue())
                .from(vacancy)
                .leftJoin(category).on(vacancy.categoryId.eq(category.id))
                .where(vacancy.companyId.eq(companyId))
                .fetch();

        List<VacancyCompanyResponse> responses = rows.stream()
                .map(t -> {
                    VacancyCompanyResponse dto = vacancyMapper.toCompanyResponse(t.get(vacancy));
                    dto.setCategoryName(t.get(category.name.stringValue()));
                    return dto;
                })
                .toList();

        return new VacancyCompanyListResponse(responses);
    }


    @Override
    public Page<VacancyResponse> filterVacancies(VacancyFilterRequest filter, Pageable pageable) {
        Long companyId = currentUserService.getCurrentCompanyId();
        QVacancy vacancy = QVacancy.vacancy;
        QCategory category = QCategory.category;

        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and(filter.locationTypeId() != null ? vacancy.locationTypeId.eq(filter.locationTypeId()) : null);
        if (filter.categoryIds() != null && !filter.categoryIds().isEmpty()) {
            predicate.and(vacancy.categoryId.in(filter.categoryIds()));
        }
        predicate.and(filter.employmentTypeId() != null ? vacancy.employmentTypeId.eq(filter.employmentTypeId()) : null);
        predicate.and(filter.workScheduleId() != null ? vacancy.workScheduleId.eq(filter.workScheduleId()) : null);
        predicate.and(filter.minSalary() != null ? vacancy.salary.goe(filter.minSalary()) : null);
        predicate.and(filter.maxSalary() != null ? vacancy.salary.loe(filter.maxSalary()) : null);
        predicate.and(filter.postedAfter() != null ? vacancy.postedAt.goe(filter.postedAfter()) : null);
        predicate.and(filter.postedBefore() != null ? vacancy.postedAt.loe(filter.postedBefore()) : null);
        predicate.and(vacancy.companyId.eq(companyId));

        List<Vacancy> results = jpaQueryFactory.selectFrom(vacancy)
                .where(predicate)
                .join(category).on(vacancy.categoryId.eq(category.id))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = jpaQueryFactory.select(vacancy.count())
                .from(vacancy)
                .where(predicate)
                .fetchOne();



        Page<Vacancy> page = PageableExecutionUtils.getPage(results, pageable, () -> total == null ? 0 : total);

        return vacancyMapper.toResponsePage(page);
    }

    @Override
    public VacancyResponse updateVacancy(String id, UpdateVacancyRequest request) {
        Vacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new VacancyNotFoundException(id));

        // Verify that the current company owns this vacancy
        verifyVacancyOwnership(vacancy);

        vacancyMapper.updateVacancyFromDto(request, vacancy);
        Vacancy updatedVacancy = vacancyRepository.save(vacancy);
        return vacancyMapper.toResponse(updatedVacancy);
    }

    @Override
    public void deleteVacancy(String id) {
        Vacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new VacancyNotFoundException(id));

        // Verify that the current company owns this vacancy
        verifyVacancyOwnership(vacancy);

        vacancyRepository.deleteById(id);
    }

    /**
     * Verifies that the current authenticated company is the owner of the vacancy
     *
     * @param vacancy The vacancy to check ownership for
     * @throws VacancyNotOwnedException if the current company is not the owner
     */
    private void verifyVacancyOwnership(Vacancy vacancy) {
        Long currentCompanyId = currentUserService.getCurrentCompanyId();

        // Check if the vacancy belongs to the current company
        if (!vacancy.getCompanyId().equals(currentCompanyId)) {
            throw new VacancyNotOwnedException(vacancy.getId());
        }
    }
}