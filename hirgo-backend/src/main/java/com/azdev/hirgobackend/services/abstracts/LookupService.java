package com.azdev.hirgobackend.services.abstracts;

import com.azdev.hirgobackend.dtos.lookup.LookupResponse;
import java.util.List;
import org.springframework.stereotype.Service;

public interface LookupService {
    LookupResponse lookup(Long id);
    LookupResponse lookup(Long id, String type);
    List<LookupResponse> lookupAllByType(String type);
}
