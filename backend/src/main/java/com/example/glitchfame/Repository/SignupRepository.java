package com.example.glitchfame.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.glitchfame.Entity.User;

public interface SignupRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByMobileNumber(String mobileNumber);
}