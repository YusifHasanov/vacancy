package com.azdev.hirgobackend.dtos.common.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

@Data
@Builder
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommonResponse<T> {

    T data;
    Pagination pagination;
    Status status;

    public static <T> CommonResponse<T> success(T data, Page<?> page) {
        return CommonResponse.<T>builder()
                .data(data)
                .pagination(new Pagination(page))
                .status(new Status("SUCCESS", "Request processed successfully"))
                .build();
    }

    public static <T> CommonResponse<T> success(T data) {
        return CommonResponse.<T>builder()
                .data(data)
                .status(new Status("SUCCESS", "Request processed successfully"))
                .build();
    }

    public static <T> CommonResponse<T> error(String message, HttpStatus status) {
        return CommonResponse.<T>builder()
                .status(new Status(status.name(), message))
                .build();
    }

    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @AllArgsConstructor
    public static class Status {
        String code;
        String message;
    }

    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Pagination {
        int page;
        int size;
        long totalElements;
        int totalPages;
        boolean lastPage;

        public Pagination(Page<?> page) {
            this.page = page.getNumber() + 1;
            this.size = page.getSize();
            this.totalElements = page.getTotalElements();
            this.totalPages = page.getTotalPages();
            this.lastPage = page.isLast();
        }
    }
}