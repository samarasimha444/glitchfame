package com.example.glitchfame.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.glitchfame.Entity.User;

@Repository
public interface UserProfileRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}