//package com.azdev.hirgobackend.backuptemp;
//
//
//import com.nimbusds.jose.jwk.JWK;
//import com.nimbusds.jose.jwk.JWKSet;
//import com.nimbusds.jose.jwk.RSAKey;
//import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
//import com.nimbusds.jose.jwk.source.JWKSource;
//import com.nimbusds.jose.proc.SecurityContext;
//import java.io.InputStream;
//import java.security.KeyFactory;
//import java.security.interfaces.RSAPrivateKey;
//import java.security.interfaces.RSAPublicKey;
//import java.security.spec.PKCS8EncodedKeySpec;
//import java.security.spec.X509EncodedKeySpec;
//import java.util.Base64;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.io.Resource;
//import org.springframework.scheduling.annotation.EnableScheduling;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.ProviderManager;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.oauth2.jwt.JwtDecoder;
//import org.springframework.security.oauth2.jwt.JwtEncoder;
//import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
//import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
//import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
//import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.util.FileCopyUtils;
//
///**
// * Security configuration for the main application.
// *
// * @author Josh Cummings
// */
//@Configuration
//@EnableScheduling
//public class RestConfig {
//
//    @Value("${jwt.public.key}")
//    private Resource publicKeyResource;
//
//    @Value("${jwt.private.key}")
//    private Resource privateKeyResource;
//
//    private final BlacklistAwareJwtAuthenticationConverter jwtAuthConverter;
//
//    public RestConfig(BlacklistAwareJwtAuthenticationConverter jwtAuthConverter) {
//        this.jwtAuthConverter = jwtAuthConverter;
//    }
//
//    @Bean
//    @SuppressWarnings("Deprecated")
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .authorizeHttpRequests((authorize) -> authorize
//                        .requestMatchers("/login").permitAll()
//                        .requestMatchers("/register").permitAll()
//                        .requestMatchers("/register/company").permitAll()
//                        .requestMatchers("/register/applicant").permitAll()
//                        .requestMatchers("/refresh-token").permitAll()
//                        .requestMatchers("/logout").permitAll()
//                        .requestMatchers("/test-logout").permitAll()
//                        .requestMatchers("/api/auth/logout").permitAll()
//                        .requestMatchers("/logout-get").permitAll()
//                        .requestMatchers("/api/logout/**").permitAll()
//                        .anyRequest().authenticated()
//                )
//                .csrf((csrf) ->
//                        csrf.ignoringRequestMatchers("/token", "/login", "/register", "/register/company", "/register/applicant",
//                                                  "/refresh-token", "/logout", "/test-logout", "/api/auth/logout",
//                                                  "/logout-get", "/api/logout/**", "/pr"))
//                .httpBasic(Customizer.withDefaults())
//                .oauth2ResourceServer(ors -> ors
//                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter)))
//                .sessionManagement((session) ->
//                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .exceptionHandling(ex -> ex
//                        .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
//                        .accessDeniedHandler(new BearerTokenAccessDeniedHandler()));
//        return http.build();
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
//        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//        authProvider.setUserDetailsService(userDetailsService);
//        authProvider.setPasswordEncoder(passwordEncoder);
//        return new ProviderManager(authProvider);
//    }
//
//    @Bean
//    public UserDetailsService userDetailsService(CustomUserDetailsService customUserDetailsService) {
//        return customUserDetailsService;
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    private RSAPublicKey getPublicKey() throws Exception {
//        try (InputStream is = publicKeyResource.getInputStream()) {
//            String key = new String(FileCopyUtils.copyToByteArray(is))
//                    .replace("-----BEGIN PUBLIC KEY-----", "")
//                    .replace("-----END PUBLIC KEY-----", "")
//                    .replaceAll("\\s", "");
//
//            byte[] decoded = Base64.getDecoder().decode(key);
//            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
//            return (RSAPublicKey) keyFactory.generatePublic(new X509EncodedKeySpec(decoded));
//        }
//    }
//
//    private RSAPrivateKey getPrivateKey() throws Exception {
//        try (InputStream is = privateKeyResource.getInputStream()) {
//            String key = new String(FileCopyUtils.copyToByteArray(is))
//                    .replace("-----BEGIN PRIVATE KEY-----", "")
//                    .replace("-----END PRIVATE KEY-----", "")
//                    .replaceAll("\\s", "");
//
//            byte[] decoded = Base64.getDecoder().decode(key);
//            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
//            return (RSAPrivateKey) keyFactory.generatePrivate(new PKCS8EncodedKeySpec(decoded));
//        }
//    }
//
//    @Bean
//    JwtDecoder jwtDecoder() throws Exception {
//        return NimbusJwtDecoder.withPublicKey(getPublicKey()).build();
//    }
//
//    @Bean
//    JwtEncoder jwtEncoder() throws Exception {
//        JWK jwk = new RSAKey.Builder(getPublicKey()).privateKey(getPrivateKey()).build();
//        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
//        return new NimbusJwtEncoder(jwks);
//    }
//}