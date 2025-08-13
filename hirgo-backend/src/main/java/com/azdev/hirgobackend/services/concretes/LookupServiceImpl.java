package com.azdev.hirgobackend.services.concretes;

import com.azdev.hirgobackend.dtos.lookup.LookupResponse;
import com.azdev.hirgobackend.exceptions.domain.lookup.LookupNotFound;
import com.azdev.hirgobackend.mappers.LookupMapper;
import com.azdev.hirgobackend.models.lookup.Lookup;
import com.azdev.hirgobackend.repositories.LookupRepository;
import com.azdev.hirgobackend.services.abstracts.LookupService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class LookupServiceImpl implements LookupService {

    LookupRepository lookupRepository;
    LookupMapper lookupMapper;

    @Override
    public LookupResponse lookup(Long id) {
        Lookup lookup = lookupRepository.findById(id)
                .orElseThrow(() -> new LookupNotFound(id));
        return lookupMapper.toResponse(lookup);
    }

    @Override
    public LookupResponse lookup(Long id, String type) {
        if (type != null && !type.isBlank()) {
            Lookup lookup = lookupRepository.findByIdAndType(id, type);
            return lookupMapper.toResponse(lookup);
        }

        return this.lookup(id);
    }

    @Override
    public List<LookupResponse> lookupAllByType(String type) {
        List<Lookup> lookups = lookupRepository.findAllByType(type);
        return lookupMapper.toListResponse(lookups);
    }

}