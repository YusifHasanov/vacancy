package com.azdev.hirgobackend.exceptions.domain.category;

import com.azdev.hirgobackend.exceptions.common.base.BaseException;
import com.azdev.hirgobackend.exceptions.common.message.ErrorMessage;
import com.azdev.hirgobackend.exceptions.common.message.MessageProvider;
import org.springframework.http.HttpStatus;

public class CategoryNotFoundException extends BaseException {
    public CategoryNotFoundException(Long id) {
        super(MessageProvider.getMessage(ErrorMessage.CATEGORY_NOT_FOUND, id), HttpStatus.NOT_FOUND);
    }
} 