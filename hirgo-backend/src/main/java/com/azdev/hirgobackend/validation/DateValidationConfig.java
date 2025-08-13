package com.azdev.hirgobackend.validation;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.datetime.standard.DateTimeFormatterRegistrar;
import org.springframework.format.support.DefaultFormattingConversionService;
import org.springframework.format.support.FormattingConversionService;

import java.time.format.DateTimeFormatter;

/**
 * Configuration class for date validation.
 * Ensures consistent date format handling across the application.
 */
@Configuration
public class DateValidationConfig {

    @Bean
    public FormattingConversionService conversionService() {
        DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService(false);
        
        DateTimeFormatterRegistrar registrar = new DateTimeFormatterRegistrar();
        registrar.setDateFormatter(DateTimeFormatter.ISO_DATE);  // yyyy-MM-dd
        registrar.setDateTimeFormatter(DateTimeFormatter.ISO_DATE_TIME);  // yyyy-MM-dd'T'HH:mm:ss
        registrar.registerFormatters(conversionService);
        
        return conversionService;
    }
} 