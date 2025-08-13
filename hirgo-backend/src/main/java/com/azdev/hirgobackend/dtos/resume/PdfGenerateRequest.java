package com.azdev.hirgobackend.dtos.resume;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PdfGenerateRequest {
    @NotBlank(message = "HTML content cannot be blank")
    private String html;
}