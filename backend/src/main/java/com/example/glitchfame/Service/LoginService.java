package com.example.glitchfame.Service;

import com.example.glitchfame.Configuration.jwt.JwtUtil;
import com.example.glitchfame.Entity.User;
import com.example.glitchfame.Repository.LoginRepository;
import com.example.glitchfame.dto.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final LoginRepository loginRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String loginUser(LoginRequest request) {

        User user = loginRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("INVALID_EMAIL"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("INVALID_PASSWORD");

        return jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );
    }
}