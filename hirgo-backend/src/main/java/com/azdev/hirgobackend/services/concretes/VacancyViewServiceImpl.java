package com.azdev.hirgobackend.services.concretes;

import com.azdev.hirgobackend.models.vacancy.VacancyView;
import com.azdev.hirgobackend.models.vacancy.VacancyViewLog;
import com.azdev.hirgobackend.repositories.VacancyViewLogRepository;
import com.azdev.hirgobackend.repositories.VacancyViewRepository;
import com.azdev.hirgobackend.services.abstracts.VacancyViewService;
import com.azdev.hirgobackend.utils.IpHashUtils;

import java.time.LocalDateTime;
import java.util.Optional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VacancyViewServiceImpl implements VacancyViewService {

    VacancyViewRepository vacancyViewRepository;
    VacancyViewLogRepository vacancyViewLogRepository;

    @Async
    @Override
    @Transactional
    public void incrementViewCountAsync(String vacancyId) {
        try {
            log.debug("Incrementing view count for vacancy: {}", vacancyId);
            vacancyViewRepository.incrementViewCount(vacancyId);
            log.debug("Successfully incremented view count for vacancy: {}", vacancyId);
        } catch (Exception e) {
            log.error("Error incrementing view count for vacancy {}: {}", vacancyId, e.getMessage());
            // Don't rethrow - we don't want to fail the main request if this fails
        }
    }
    
    @Async
    @Override
    @Transactional
    public void incrementUniqueViewCountAsync(String vacancyId, String ipAddress) {
        try {
            String anonymizedIp = IpHashUtils.anonymizeIp(ipAddress);
            log.debug("Checking if vacancy {} has been viewed from IP {}", vacancyId, anonymizedIp);
            
            boolean isNewView = logViewFromIp(vacancyId, ipAddress);
            
            if (isNewView) {
                log.debug("New unique view from IP {} for vacancy {}, incrementing count", anonymizedIp, vacancyId);
                vacancyViewRepository.incrementViewCount(vacancyId);
                log.debug("Successfully incremented unique view count for vacancy: {}", vacancyId);
            } else {
                log.debug("Vacancy {} already viewed from IP {}, not incrementing count", vacancyId, anonymizedIp);
            }
        } catch (Exception e) {
            log.error("Error processing unique view for vacancy {} from IP: {}", vacancyId, e.getMessage());
            // Don't rethrow - we don't want to fail the main request if this fails
        }
    }
    
    @Override
    @Transactional
    public boolean logViewFromIp(String vacancyId, String ipAddress) {
        String ipHash = IpHashUtils.hashIpAndVacancyId(ipAddress, vacancyId);
        
        // Check if this IP has already viewed this vacancy
        if (vacancyViewLogRepository.existsByIpHashAndVacancyId(ipHash, vacancyId)) {
            return false;
        }
        
        // Log the new view
        VacancyViewLog viewLog = new VacancyViewLog();
        viewLog.setIpHash(ipHash);
        viewLog.setVacancyId(vacancyId);
        viewLog.setViewedAt(LocalDateTime.now());
        
        vacancyViewLogRepository.save(viewLog);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public long getViewCount(String vacancyId) {
        return vacancyViewRepository.findByVacancyId(vacancyId)
                .map(VacancyView::getViewCount)
                .orElse(0L);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<VacancyView> getVacancyView(String vacancyId) {
        return vacancyViewRepository.findByVacancyId(vacancyId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<VacancyViewLog> getViewLogByIpAndVacancy(String vacancyId, String ipAddress) {
        String ipHash = IpHashUtils.hashIpAndVacancyId(ipAddress, vacancyId);
        return vacancyViewLogRepository.findByIpHashAndVacancyId(ipHash, vacancyId);
    }
} 