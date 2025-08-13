package com.azdev.hirgobackend.dtos.resume;

import lombok.Data;

@Data
public class ResumeUpdateRequest {
    private String templateId;
    private String data; // JSON verisi string olarak alınacak
}