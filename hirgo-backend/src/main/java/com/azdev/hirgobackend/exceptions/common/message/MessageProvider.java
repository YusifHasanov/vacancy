package com.azdev.hirgobackend.exceptions.common.message;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class MessageProvider {
    public static String getMessage(ErrorMessage errorMessage, Object... args) {
        return String.format(errorMessage.getMessage(), args);
    }
} 