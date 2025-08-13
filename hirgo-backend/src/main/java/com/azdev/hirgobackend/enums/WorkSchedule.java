package com.azdev.hirgobackend.enums;

import lombok.Getter;

@Getter
public enum WorkSchedule {
    FULL_TIME("Tam ştat"),
    PART_TIME("Yarı ştat"),
    FREE_LANCE("Frilans"),
    REMOTE("Uzaqdan iş");

    private final String value;

    WorkSchedule(String value) {
        this.value = value;
    }

}