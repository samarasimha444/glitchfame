package com.example.glitchfame.Repository.AuthRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.glitchfame.Entity.User;

import java.util.Optional;

public interface LoginRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}