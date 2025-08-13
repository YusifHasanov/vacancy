package com.azdev.hirgobackend.security.config;

import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.KeyFactory;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.stream.Collectors;

/**
 * Configuration properties for RSA keys used in JWT signing/verification
 */
@Setter
@ConfigurationProperties(prefix = "rsa")
public class RsaKeyProperties {
    private Resource publicKey;
    private Resource privateKey;

    public RSAPublicKey getPublicKey() throws Exception {
        String key = readKey(publicKey);
        String publicKeyPEM = key
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");

        byte[] encoded = Base64.getDecoder().decode(publicKeyPEM.getBytes());
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(encoded);
        return (RSAPublicKey) keyFactory.generatePublic(keySpec);
    }

    public RSAPrivateKey getPrivateKey() throws Exception {
        String key = readKey(privateKey);
        String privateKeyPEM = key
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");

        byte[] encoded = Base64.getDecoder().decode(privateKeyPEM.getBytes());
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encoded);
        return (RSAPrivateKey) keyFactory.generatePrivate(keySpec);
    }

    private String readKey(Resource resource) throws IOException {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream()))) {
            return reader.lines().collect(Collectors.joining("\n"));
        }
    }
} 