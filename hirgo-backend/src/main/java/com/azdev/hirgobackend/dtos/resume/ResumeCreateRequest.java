package com.azdev.hirgobackend.dtos.resume;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResumeCreateRequest {

    @NotBlank(message = "Template ID cannot be blank")
    private String templateId;

    @NotNull(message = "Resume data cannot be null")
    private String data; // JSON verisi string olarak alınacak
}