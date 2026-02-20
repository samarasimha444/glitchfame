package com.example.glitchfame.Service;

import com.example.glitchfame.Configuration.jwt.JwtUtil;
import com.example.glitchfame.Entity.User;
import com.example.glitchfame.Repository.UserRepository;
import com.example.glitchfame.dto.SignupRequest;
import com.example.glitchfame.dto.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public User registerUser(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("EMAIL_EXISTS");

        if (userRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("USERNAME_EXISTS");

        if (userRepository.existsByMobileNumber(request.getPhoneNumber()))
            throw new RuntimeException("MOBILE_EXISTS");

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .mobileNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(com.example.glitchfame.Entity.Role.USER) // force default
                .createdAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    public String loginUser(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("INVALID_EMAIL"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("INVALID_PASSWORD");

       return jwtUtil.generateToken(
            user.getEmail(),
            user.getRole().name()
    );
    }
}