package com.example.glitchfame.Auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<User, Long> {

    // Login
    Optional<User> findByEmail(String email);
        // Registration validations
        boolean existsByEmail(String email);
        boolean existsByUsername(String username);
        boolean existsByMobileNumber(String mobileNumber);
        
}