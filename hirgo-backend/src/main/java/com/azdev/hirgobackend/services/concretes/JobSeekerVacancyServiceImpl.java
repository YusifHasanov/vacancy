package com.azdev.hirgobackend.services.concretes;

import com.azdev.hirgobackend.dtos.vacancy.request.JobSeekerVacancyFilterRequest;
import com.azdev.hirgobackend.dtos.vacancy.response.jobseeker.JobSeekerVacancyDetailsResponse;
import com.azdev.hirgobackend.dtos.vacancy.response.jobseeker.JobSeekerVacancyTableResponse;
import com.azdev.hirgobackend.repositories.JobSeekerVacancyRepository;
import com.azdev.hirgobackend.services.abstracts.JobSeekerVacancyService;
import com.azdev.hirgobackend.services.abstracts.VacancyViewService;
import com.azdev.hirgobackend.utils.IpHashUtils;
import com.azdev.hirgobackend.utils.RequestUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobSeekerVacancyServiceImpl implements JobSeekerVacancyService {

    JobSeekerVacancyRepository jobSeekerVacancyRepository;
    VacancyViewService vacancyViewService;
    HttpServletRequest request;

    @Override
    public JobSeekerVacancyDetailsResponse getVacancyByIdForDetails(String id) {
        JobSeekerVacancyDetailsResponse response = jobSeekerVacancyRepository.getVacancyDetailsById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vacancy not found"));
        
        try {
            String ipAddress = RequestUtils.getClientIpAddress(request);
            String anonymizedIp = IpHashUtils.anonymizeIp(ipAddress);
            
            vacancyViewService.incrementUniqueViewCountAsync(id, ipAddress);
            log.debug("Unique view count increment for vacancy {} from IP {} has been scheduled", 
                    id, anonymizedIp);
        } catch (Exception e) {
            log.error("Failed to schedule view count increment for vacancy {}: {}", id, e.getMessage());
        }
        
        return response;
    }


    @Override
    public Page<JobSeekerVacancyTableResponse> getAllVacanciesForTable(Pageable pageable) {
        return jobSeekerVacancyRepository.getAllVacanciesForTable(pageable);
    }

    @Override
    public Page<JobSeekerVacancyTableResponse> getAllVacanciesByFilter(JobSeekerVacancyFilterRequest filter, Pageable pageable) {
        log.debug("Filter parameters: categoryId={}, locationTypeId={}, employmentTypeId={}, workScheduleId={}, minSalary={}, maxSalary={}, postedTime={}",
                filter.categoryId(), filter.locationTypeId(), filter.employmentTypeId(), 
                filter.workScheduleId(), filter.minSalary(), filter.maxSalary(), filter.postedTime());
        
        Long locationTypeId = filter.locationTypeId();
        Long categoryId = filter.categoryId();
        Long minSalary = filter.minSalary();
        Long maxSalary = filter.maxSalary();
        Long employmentTypeId = filter.employmentTypeId();
        Long workScheduleId = filter.workScheduleId();
        
        Timestamp postedTimeDate = null;
        if (filter.postedTime() != null) {
            LocalDateTime now = LocalDateTime.now();
            switch (filter.postedTime()) {
                case LAST_WEEK -> postedTimeDate = Timestamp.valueOf(now.minusDays(7));
                case LAST_MONTH -> postedTimeDate = Timestamp.valueOf(now.minusDays(30));
                case NEW -> postedTimeDate = Timestamp.valueOf(now.minusDays(3));
            }
        }

        log.debug("Posted Time Date: {}", postedTimeDate);
        
        Page<JobSeekerVacancyTableResponse> result = jobSeekerVacancyRepository.findVacanciesWithFilters(
                locationTypeId,
                categoryId,
                minSalary,
                maxSalary,
                employmentTypeId,
                workScheduleId,
                postedTimeDate,
                pageable);
                
        log.debug("Result size: {}", result.getContent().size());
        return result;
    }
}
