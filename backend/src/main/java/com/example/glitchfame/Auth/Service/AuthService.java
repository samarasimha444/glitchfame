package com.example.glitchfame.Auth.Service;

import com.example.glitchfame.Auth.AuthRepository;
import com.example.glitchfame.Auth.User;
import com.example.glitchfame.Auth.DTO.LoginDTO;
import com.example.glitchfame.Auth.DTO.ProfileResponseDTO;
import com.example.glitchfame.Auth.DTO.RegisterDTO;
import com.example.glitchfame.Auth.Service.emails.OtpService;
import com.example.glitchfame.Auth.Service.emails.OtpType;
import com.example.glitchfame.Configuration.jwt.JwtUtil;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;

import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final ExtractJwtData extractJwtData;
    private final JwtUtil jwtUtil;
    private final RedisTemplate<String,String> redisTemplate;
    private final OtpService otpService;

    // ================= REGISTER (SEND OTP) =================
    public ResponseEntity<String> register(RegisterDTO dto){

        if(authRepository.existsByEmail(dto.getEmail())){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already exists");
        }

        if(authRepository.existsByUsername(dto.getUsername())){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }

        if(authRepository.existsByMobileNumber(dto.getMobileNumber())){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Mobile number already exists");
        }

        String registerKey = "REGISTER:" + dto.getEmail();

        redisTemplate.opsForValue().set(
                registerKey,
                dto.getEmail() + "|" +
                dto.getUsername() + "|" +
                dto.getMobileNumber() + "|" +
                dto.getPassword(),
                Duration.ofMinutes(5)
        );

        otpService.sendOtp(dto.getEmail(), OtpType.REGISTER);

        return ResponseEntity.ok("OTP sent to your email");
    }

    // ================= VERIFY REGISTER OTP =================
    public ResponseEntity<String> verifyOtp(String email,String otp){

        boolean valid = otpService.verifyOtp(email, otp, OtpType.REGISTER);

        if(!valid){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid OTP");
        }

        String userData = redisTemplate.opsForValue().get("REGISTER:" + email);

        if(userData == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Registration data expired");
        }

        String[] parts = userData.split("\\|");

        User user = User.builder()
                .email(parts[0])
                .username(parts[1])
                .mobileNumber(parts[2])
                .password(passwordEncoder.encode(parts[3]))
                .build();

        authRepository.save(user);

        redisTemplate.delete("REGISTER:" + email);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered successfully");
    }

    // ================= LOGIN =================
    public ResponseEntity<?> login(LoginDTO dto){

        User user = authRepository.findByEmail(dto.getEmail())
                .orElse(null);

        if(user == null ||
           !passwordEncoder.matches(dto.getPassword(), user.getPassword())){

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getRole().name()
        );

        redisTemplate.opsForValue().set(
                "auth:user:" + user.getId(),
                token,
                Duration.ofHours(24)
        );

        return ResponseEntity.ok(token);
    }

    // ================= FORGOT PASSWORD =================
    public ResponseEntity<String> forgotPassword(String email){

        User user = authRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        otpService.sendOtp(user.getEmail(), OtpType.FORGOT_PASSWORD);

        return ResponseEntity.ok("OTP sent to your email");
    }

    // ================= RESET PASSWORD =================
    @Transactional
    public ResponseEntity<String> resetPassword(
            String email,
            String otp,
            String newPassword){

        boolean valid = otpService.verifyOtp(
                email,
                otp,
                OtpType.FORGOT_PASSWORD
        );

        if(!valid){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid or expired OTP");
        }

        User user = authRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        if(newPassword == null || newPassword.length() < 6){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password must be at least 6 characters"
            );
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        return ResponseEntity.ok("Password reset successfully");
    }

    // ================= GET PROFILE =================
    public ProfileResponseDTO getProfile(Long userId){

        User user = authRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        return ProfileResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .role(user.getRole().name())
                .canVote(user.isCanVote())
                .canParticipate(user.isCanParticipate())
                .profilePicture(user.getProfilePicture())
                .build();
    }

    // ================= DELETE ACCOUNT =================
    public void deleteMyAccount(){

        Long userId = extractJwtData.getUserId();

        if(!authRepository.existsById(userId)){
            throw new RuntimeException("User not found");
        }

        authRepository.deleteById(userId);
    }
}