package com.azdev.hirgobackend.advice;

import com.azdev.hirgobackend.dtos.common.response.CommonResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.MethodParameter;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@ControllerAdvice
public class ResponseAdvice implements ResponseBodyAdvice<Object> {

    private final ObjectMapper objectMapper;

    public ResponseAdvice(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean supports(@NonNull MethodParameter returnType, @NonNull Class converterType) {
        return true;
    }

    @Override
    @ResponseBody
    public Object beforeBodyWrite(Object body,
                                  @NonNull MethodParameter returnType,
                                  @NonNull MediaType selectedContentType,
                                  @NonNull Class selectedConverterType,
                                  @NonNull org.springframework.http.server.ServerHttpRequest request,
                                  @NonNull ServerHttpResponse response) {

        String requestPath = request.getURI().getPath();
        if (requestPath.startsWith("/v3/api-docs") || requestPath.startsWith("/swagger-ui") || requestPath.contains("/generate-pdf")) {
            return body;
        }

        if (body instanceof CommonResponse) {
            return body;
        }

        if (body instanceof String) {
            try {
                return objectMapper.writeValueAsString(CommonResponse.success(body));
            } catch (Exception e) {
                return body;
            }
        }

        if (body instanceof Page<?> page) {
            return CommonResponse.success(page.getContent(), page);
        }

        if (body instanceof ResponseEntity<?> entity) {
            Object entityBody = entity.getBody();
            if (entityBody instanceof Page<?> page) {
                return ResponseEntity.status(entity.getStatusCode())
                        .body(CommonResponse.success(page.getContent(), page));
            }
            return ResponseEntity.status(entity.getStatusCode())
                    .body(CommonResponse.success(entityBody));
        }

        return CommonResponse.success(body);
    }
}