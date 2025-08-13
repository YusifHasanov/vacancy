package com.azdev.hirgobackend.services.abstracts;

import com.azdev.hirgobackend.dtos.company.request.CreateCompanyRequest;
import com.azdev.hirgobackend.dtos.company.request.UpdateCompanyRequest;
import com.azdev.hirgobackend.dtos.company.response.CompanyResponse;
import java.util.List;

public interface CompanyService {
    CompanyResponse getCompanyById(Long id);

    List<CompanyResponse> getAllCompanies();

    List<CompanyResponse> searchCompaniesByName(String name);

    CompanyResponse createCompany(CreateCompanyRequest company);

    CompanyResponse updateCompany(Long id, UpdateCompanyRequest company);

    void deleteCompany(Long id);
}