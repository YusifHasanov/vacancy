package com.azdev.hirgobackend.models.lookup;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Table(name = "lookups")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Lookup {
    @Id
    Long id;
    String name;
    String type;
}
