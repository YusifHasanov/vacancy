package com.azdev.hirgobackend.mappers;

import com.azdev.hirgobackend.dtos.lookup.LookupResponse;
import com.azdev.hirgobackend.models.lookup.Lookup;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedSourcePolicy = ReportingPolicy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LookupMapper {
    LookupResponse toResponse(Lookup lookup);
    List<LookupResponse> toListResponse(List<Lookup> lookups);
}