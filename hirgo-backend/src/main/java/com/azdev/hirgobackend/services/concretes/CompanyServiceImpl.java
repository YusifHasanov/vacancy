package com.azdev.hirgobackend.services.concretes;

import com.azdev.hirgobackend.dtos.company.request.CreateCompanyRequest;
import com.azdev.hirgobackend.dtos.company.request.UpdateCompanyRequest;
import com.azdev.hirgobackend.dtos.company.response.CompanyResponse;
import com.azdev.hirgobackend.exceptions.domain.company.CompanyNotFound;
import com.azdev.hirgobackend.mappers.CompanyMapper;
import com.azdev.hirgobackend.models.company.Company;
import com.azdev.hirgobackend.repositories.CompanyRepository;
import com.azdev.hirgobackend.services.abstracts.CompanyService;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    CompanyRepository companyRepository;
    CompanyMapper companyMapper;
    JPAQueryFactory context;


    @Override
    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id).orElseThrow(() -> new CompanyNotFound(id));
        return companyMapper.toResponse(company);
    }

    @Override
    public List<CompanyResponse> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        return companyMapper.toResponseList(companies);
    }

    @Override
    public List<CompanyResponse> searchCompaniesByName(String name) {
        List<Company> companies = companyRepository.searchByName(name);
        return companyMapper.toResponseList(companies);
    }

    @Override
    public CompanyResponse createCompany(CreateCompanyRequest company) {
        Company newCompany = companyMapper.createCompanyRequestToEntity(company);
        Company savedCompany = companyRepository.save(newCompany);

        return companyMapper.toResponse(savedCompany);
    }

    @Override
    public CompanyResponse updateCompany(Long id, UpdateCompanyRequest company) {
        Company oldCompany = companyRepository.findById(id).orElseThrow(() -> new CompanyNotFound(id));
        companyMapper.updateCompanyRequestToEntity(oldCompany, company);

        companyRepository.save(oldCompany);

        return companyMapper.toResponse(oldCompany);
    }

    @Override
    public void deleteCompany(Long id) {
        companyRepository.deleteById(id);
    }

}