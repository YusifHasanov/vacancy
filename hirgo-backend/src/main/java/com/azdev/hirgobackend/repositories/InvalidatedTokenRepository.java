package com.azdev.hirgobackend.repositories;

import com.azdev.hirgobackend.models.token.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, Long> {
    boolean existsByToken(String token);
    
    @Modifying
    @Query("DELETE FROM InvalidatedToken t WHERE t.expiryDate < :now")
    void deleteExpiredTokens(Date now);
    
    // This method is not needed anymore as we're only checking specific tokens
    // @Query("SELECT t FROM InvalidatedToken t WHERE t.userId = :userId AND t.tokenType = 'ACCESS'")
    // List<InvalidatedToken> findAllAccessTokensByUserId(@Param("userId") Long userId);
    
    // This method is not needed anymore as we're only checking specific tokens
    // boolean existsByUserIdAndTokenType(Long userId, String tokenType);
    
    // Find tokens by family
    List<InvalidatedToken> findByTokenFamily(String tokenFamily);
    
    // Check if a token family exists
    boolean existsByTokenFamily(String tokenFamily);
} 