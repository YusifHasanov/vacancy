package com.azdev.hirgobackend.services.abstracts;

import com.azdev.hirgobackend.models.vacancy.VacancyView;
import com.azdev.hirgobackend.models.vacancy.VacancyViewLog;

import java.util.Optional;

public interface VacancyViewService {
    
    /**
     * Increment the view count for a vacancy asynchronously
     * 
     * @param vacancyId The ID of the vacancy
     */
    void incrementViewCountAsync(String vacancyId);
    
    /**
     * Increment the view count for a vacancy only if this IP hasn't viewed it before
     * 
     * @param vacancyId The ID of the vacancy
     * @param ipAddress The IP address of the viewer
     */
    void incrementUniqueViewCountAsync(String vacancyId, String ipAddress);
    
    /**
     * Log that an IP address has viewed a vacancy
     * 
     * @param vacancyId The ID of the vacancy
     * @param ipAddress The IP address of the viewer
     * @return True if this is a new view from this IP, false if already viewed
     */
    boolean logViewFromIp(String vacancyId, String ipAddress);
    
    /**
     * Get the view count for a vacancy
     * 
     * @param vacancyId The ID of the vacancy
     * @return The view count or 0 if not found
     */
    long getViewCount(String vacancyId);
    
    /**
     * Get the VacancyView entity for a vacancy
     * 
     * @param vacancyId The ID of the vacancy
     * @return Optional containing the VacancyView if found
     */
    Optional<VacancyView> getVacancyView(String vacancyId);
    
    /**
     * Get the log of a vacancy view by an IP address
     * 
     * @param vacancyId The ID of the vacancy
     * @param ipAddress The IP address of the viewer
     * @return Optional containing the VacancyViewLog if found
     */
    Optional<VacancyViewLog> getViewLogByIpAndVacancy(String vacancyId, String ipAddress);
} 