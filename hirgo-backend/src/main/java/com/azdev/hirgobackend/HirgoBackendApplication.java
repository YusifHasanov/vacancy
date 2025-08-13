package com.azdev.hirgobackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HirgoBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(HirgoBackendApplication.class, args);
    }
    
}
