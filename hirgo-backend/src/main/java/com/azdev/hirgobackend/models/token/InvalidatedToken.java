package com.azdev.hirgobackend.models.token;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "invalidated_tokens", schema = "auth")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvalidatedToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String token;
    
    @Column(name = "expiry_date", nullable = false)
    private Date expiryDate;
    
    @Column(name = "invalidated_at", nullable = false)
    private Date invalidatedAt;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "token_type")
    private String tokenType;
    
    @Column(name = "token_family")
    private String tokenFamily;
} 