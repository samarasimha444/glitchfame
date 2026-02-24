package com.example.glitchfame.Repository.AuthRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.glitchfame.Entity.User;

import java.util.Optional;

public interface SignupRepository extends JpaRepository<User, Long> {

    boolean existsByEmailAndDeletedFalse(String email);

    boolean existsByUsernameAndDeletedFalse(String username);

    boolean existsByMobileNumberAndDeletedFalse(String mobileNumber);

    Optional<User> findByEmailAndDeletedFalse(String email);
}