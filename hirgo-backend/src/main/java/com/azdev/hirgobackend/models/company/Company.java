package com.azdev.hirgobackend.models.company;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Table(name = "companies")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String name;
    String description;
    String logo;
    String location;
    String phoneNumber;
    String address;
}