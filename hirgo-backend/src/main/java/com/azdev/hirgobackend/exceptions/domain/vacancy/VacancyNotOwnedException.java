package com.azdev.hirgobackend.exceptions.domain.vacancy;

import com.azdev.hirgobackend.exceptions.common.base.BaseException;
import com.azdev.hirgobackend.exceptions.common.message.ErrorMessage;
import com.azdev.hirgobackend.exceptions.common.message.MessageProvider;
import org.springframework.http.HttpStatus;

public class VacancyNotOwnedException extends BaseException {
    public VacancyNotOwnedException(String id) {
        super(MessageProvider.getMessage(ErrorMessage.VACANCY_NOT_OWNED, id), HttpStatus.FORBIDDEN);
    }
} 