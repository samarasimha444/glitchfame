package com.example.glitchfame.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.glitchfame.Entity.User;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByMobileNumber(String mobileNumber);
    Optional<User> findByEmail(String email); // ✅ Needed for login
}