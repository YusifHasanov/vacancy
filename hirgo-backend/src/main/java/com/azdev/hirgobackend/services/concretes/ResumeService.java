package com.azdev.hirgobackend.services.concretes;

import com.azdev.hirgobackend.dtos.resume.ResumeCreateRequest;
import com.azdev.hirgobackend.dtos.resume.ResumeResponse;
import com.azdev.hirgobackend.dtos.resume.ResumeUpdateRequest;
import com.azdev.hirgobackend.repositories.ResumeRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.azdev.hirgobackend.models.resume.Resume;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;


    @Transactional
    public ResumeResponse upsertResumeForUser(ResumeCreateRequest request, UUID userId) {
        Optional<Resume> existingResumeOpt = resumeRepository.findByUserId(userId).stream().findFirst();

        Resume resumeToSave;

        if (existingResumeOpt.isPresent()) {
            resumeToSave = existingResumeOpt.get();
        } else {
            resumeToSave = new Resume();
            resumeToSave.setUserId(userId);
        }

        resumeToSave.setTemplateId(request.getTemplateId());
        resumeToSave.setData(request.getData());

        Resume savedResume = resumeRepository.save(resumeToSave);
        return mapToResponse(savedResume);
    }


    @Transactional
    public ResumeResponse createResume(ResumeCreateRequest request, UUID userId) {
        Resume resume = new Resume();
        resume.setUserId(userId);
        resume.setTemplateId(request.getTemplateId());
        resume.setData(request.getData());

        Resume savedResume = resumeRepository.save(resume);
        return mapToResponse(savedResume);
    }

    @Transactional(readOnly = true)
    public List<ResumeResponse> getAllResumesForUser(UUID userId) {
        return resumeRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }



    @Transactional(readOnly = true)
    public ResumeResponse getResumeByIdForUser(Long resumeId, UUID userId) {
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Resume not found with id: " + resumeId));
        return mapToResponse(resume);
    }

    @Transactional
    public ResumeResponse updateResume(Long resumeId, ResumeUpdateRequest request, UUID userId) {
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Resume not found with id: " + resumeId));

        if (request.getTemplateId() != null) {
            resume.setTemplateId(request.getTemplateId());
        }
        if (request.getData() != null) {
            resume.setData(request.getData());
        }

        Resume updatedResume = resumeRepository.save(resume);
        return mapToResponse(updatedResume);
    }

    @Transactional
    public void deleteResume(Long resumeId, UUID userId) {
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Resume not found with id: " + resumeId));
        resumeRepository.delete(resume);
    }

    private ResumeResponse mapToResponse(Resume resume) {
        return ResumeResponse.builder()
                .id(resume.getId())
                .userId(resume.getUserId())
                .templateId(resume.getTemplateId())
                .data(resume.getData())
                .createdAt(resume.getCreatedAt())
                .updatedAt(resume.getUpdatedAt())
                .build();
    }
}