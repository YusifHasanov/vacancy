package com.azdev.hirgobackend.exceptions.domain.lookup;

import com.azdev.hirgobackend.exceptions.common.base.BaseException;
import com.azdev.hirgobackend.exceptions.common.message.ErrorMessage;
import com.azdev.hirgobackend.exceptions.common.message.MessageProvider;
import org.springframework.http.HttpStatus;

public class LookupNotFound extends BaseException {
    public LookupNotFound(Long id) {
        super(MessageProvider.getMessage(ErrorMessage.LOOKUP_NOT_FOUND, id), HttpStatus.NOT_FOUND);
    }
}