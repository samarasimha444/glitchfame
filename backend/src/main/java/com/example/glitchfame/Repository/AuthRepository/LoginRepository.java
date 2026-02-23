package com.example.glitchfame.Repository.AuthRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.glitchfame.Entity.User;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LoginRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    @Query("SELECT u.id FROM User u WHERE u.email = :email AND u.deleted = false")
    Optional<Long> findIdByEmail(@Param("email") String email);
}