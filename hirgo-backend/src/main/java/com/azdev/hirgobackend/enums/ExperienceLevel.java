package com.azdev.hirgobackend.enums;

import lombok.Getter;

@Getter
public enum ExperienceLevel {
    INTERN("Təcrübəçi"),
    JUNIOR("Az təcrübəli (1-3 il)"),
    MIDDLE("Orta təcrübəli (3-5 il)"),
    SENIOR("Təcrübəli (5+ il)"),
    LEAD("Yüksək təcrübəli (8+ il)");

    private final String value;

    ExperienceLevel(String value) {
        this.value = value;
    }

}