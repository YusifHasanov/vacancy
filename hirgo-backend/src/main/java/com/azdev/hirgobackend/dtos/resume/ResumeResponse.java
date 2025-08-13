package com.azdev.hirgobackend.dtos.resume;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class ResumeResponse {
    private Long id;
    private UUID userId;
    private String templateId;
    private String data; // JSON string
    private Instant createdAt;
    private Instant updatedAt;
}