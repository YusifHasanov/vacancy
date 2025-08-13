package com.azdev.hirgobackend.models.vacancy;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vacancy_view_logs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"ip_hash", "vacancy_id"})
})
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VacancyViewLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    
    @Column(name = "ip_hash", nullable = false)
    String ipHash;
    
    @Column(name = "vacancy_id", nullable = false)
    String vacancyId;
    
    @Column(name = "viewed_at", nullable = false)
    LocalDateTime viewedAt;
} 