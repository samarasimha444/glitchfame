package com.example.glitchfame.Auth;
import com.example.glitchfame.Auth.DTO.LoginDTO;
import com.example.glitchfame.Auth.DTO.ProfileResponseDTO;
import com.example.glitchfame.Auth.DTO.RegisterDTO;
import com.example.glitchfame.Configuration.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.cache.annotation.Cacheable;



@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    //REGISTER
   public ResponseEntity<String> register(RegisterDTO dto) {

    if (authRepository.existsByEmail(dto.getEmail())) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("Email already exists");
    }

    if (authRepository.existsByUsername(dto.getUsername())) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("Username already exists");
    }

    if (authRepository.existsByMobileNumber(dto.getMobileNumber())) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("Mobile number already exists");
    }

    User user = User.builder()
            .email(dto.getEmail())
            .username(dto.getUsername())
            .mobileNumber(dto.getMobileNumber())
            .password(passwordEncoder.encode(dto.getPassword()))
            .build();

    authRepository.save(user);

    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body("User registered successfully");
}





//login
public ResponseEntity<?> login(LoginDTO dto) {

    User user = authRepository.findByEmail(dto.getEmail())
            .orElse(null);

    if (user == null) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials");
    }

    if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials");
    }

    String token = jwtUtil.generateToken(
            user.getId(),
            user.getRole().name()
    );

    return ResponseEntity.ok(token);
}





  //profile
   @Cacheable(value = "profiles", key = "#userId")
public ProfileResponseDTO getProfile(Long userId) {

    User user = authRepository.findById(userId)
            .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "User not found"
                    )
            );

    return ProfileResponseDTO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .mobileNumber(user.getMobileNumber())
            .role(user.getRole().name())
            .build();
}
}
