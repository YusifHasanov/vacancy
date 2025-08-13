package com.azdev.hirgobackend.enums;

public enum PostedTime {
    LAST_WEEK("Son bir həftə"),
    LAST_MONTH("Son bir ay"),
    NEW("Yeni yerləşdirilənlər");

    private final String displayName;

    PostedTime(String displayName) {
        this.displayName = displayName;
    }
}
