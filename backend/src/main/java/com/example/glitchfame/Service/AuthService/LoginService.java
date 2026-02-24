package com.example.glitchfame.Service.AuthService;
import com.example.glitchfame.Configuration.jwt.JwtUtil;
import com.example.glitchfame.Entity.User;
import com.example.glitchfame.Repository.AuthRepository.LoginRepository;
import com.example.glitchfame.dto.AuthDTO.LoginRequest;
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

        String email = request.getEmail().toLowerCase().trim();

        User user = loginRepository
                .findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new RuntimeException("EMAIL_NOT_FOUND"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("INVALID_PASSWORD");
        }

        return jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );
    }
}