package com.azdev.hirgobackend.exceptions.domain.company;

import com.azdev.hirgobackend.exceptions.common.base.BaseException;
import com.azdev.hirgobackend.exceptions.common.message.ErrorMessage;
import com.azdev.hirgobackend.exceptions.common.message.MessageProvider;
import org.springframework.http.HttpStatus;

public class CompanyNotFound extends BaseException {
    public CompanyNotFound(Long id) {
        super(MessageProvider.getMessage(ErrorMessage.COMPANY_NOT_FOUND, id), HttpStatus.NOT_FOUND);
    }
}