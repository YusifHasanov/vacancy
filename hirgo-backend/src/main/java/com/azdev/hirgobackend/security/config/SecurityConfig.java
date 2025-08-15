package com.azdev.hirgobackend.security.config;

import com.azdev.hirgobackend.security.jwt.BlacklistAwareJwtAuthenticationConverter;
import com.azdev.hirgobackend.security.service.TokenBlacklistService;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration for the application
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@EnableConfigurationProperties(RsaKeyProperties.class)
public class SecurityConfig {

    private final RsaKeyProperties rsaKeys;
    private final TokenBlacklistService blacklistService;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(RsaKeyProperties rsaKeys,
                          TokenBlacklistService blacklistService,
                          UserDetailsService userDetailsService) {
        this.rsaKeys = rsaKeys;
        this.blacklistService = blacklistService;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories","/api/v1/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/jobseeker/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/jobseeker/vacancies/filter").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/lookups**", "/api/v1/lookups/all**").permitAll()
                        .anyRequest().authenticated()
                )
                .cors(cors -> cors.configurationSource(request -> {
                    var source = new org.springframework.web.cors.CorsConfiguration();
                    source.setAllowCredentials(true);
                    source.addAllowedOrigin("https://fit2job.com"); // Allow all origins
                    source.addAllowedHeader("*"); // Allow all headers
                    source.addAllowedMethod("*"); // Allow all methods
                    return source;
                }))
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(new BlacklistAwareJwtAuthenticationConverter(blacklistService))
                        )
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtDecoder jwtDecoder() throws Exception {
        return NimbusJwtDecoder.withPublicKey(rsaKeys.getPublicKey()).build();
    }

    @Bean
    public JwtEncoder jwtEncoder() throws Exception {
        JWK jwk = new RSAKey.Builder(rsaKeys.getPublicKey())
                .privateKey(rsaKeys.getPrivateKey())
                .build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }
} 