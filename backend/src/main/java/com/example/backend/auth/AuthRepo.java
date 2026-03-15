package com.example.backend.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface AuthRepo extends JpaRepository<Auth, UUID> {

    Optional<Auth> findByEmail(String email);      // login using email
    Optional<Auth> findByUsername(String username); // login using username

    boolean existsByEmail(String email);       // check duplicate email
    boolean existsByUsername(String username); // check duplicate username
    boolean existsByMobile(String mobile);     // check duplicate mobile
}