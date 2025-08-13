package com.azdev.hirgobackend.models.vacancy;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Description {
    String[] responsibilities;
    String[] education;
    String[] experience;
    String[] requiredSkills;
    String[] preferredSkills;
}