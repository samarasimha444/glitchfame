package com.example.glitchfame.Service;

import com.example.glitchfame.Entity.User;
import com.example.glitchfame.Repository.SignupRepository;
import com.example.glitchfame.dto.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SignupService {

    private final SignupRepository signupRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(SignupRequest request) {

        if (signupRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("EMAIL_EXISTS");

        if (signupRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("USERNAME_EXISTS");

        if (signupRepository.existsByMobileNumber(request.getPhoneNumber()))
            throw new RuntimeException("MOBILE_EXISTS");

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .mobileNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .build();

        return signupRepository.save(user);
    }
}