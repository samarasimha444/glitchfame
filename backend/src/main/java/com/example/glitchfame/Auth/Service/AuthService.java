package com.example.glitchfame.Auth.Service;

import com.example.glitchfame.Auth.*;
import com.example.glitchfame.Auth.DTO.*;
import com.example.glitchfame.Auth.Service.OtpService;
import com.example.glitchfame.Configuration.jwt.JwtUtil;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;

import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
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

    // ================= REGISTER =================
public ResponseEntity<String> register(RegisterDTO dto){

    // check email
    if(authRepository.existsByEmail(dto.getEmail())){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Email already registered");
    }

    // check mobile
    if(authRepository.existsByMobileNumber(dto.getMobileNumber())){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Mobile number already registered");
    }

    // check username
    if(authRepository.existsByUsername(dto.getUsername())){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Username already taken");
    }

    String registerKey = "REGISTER:" + dto.getEmail();

    redisTemplate.opsForValue().set(
            registerKey,
            dto.getEmail()+"|"+
            dto.getUsername()+"|"+
            dto.getMobileNumber()+"|"+
            passwordEncoder.encode(dto.getPassword()),
            Duration.ofMinutes(5)
    );

    otpService.sendOtp(dto.getEmail(), OtpType.REGISTER);

    return ResponseEntity.ok("OTP sent to email");
}

// ================= VERIFY REGISTER OTP =================
public ResponseEntity<String> verifyOtp(String email,String otp){

    boolean valid = otpService.verifyOtp(email,otp,OtpType.REGISTER);

    if(!valid){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Invalid OTP");
    }

    String userData = redisTemplate.opsForValue().get("REGISTER:"+email);

    if(userData == null){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Registration expired");
    }

    String[] parts = userData.split("\\|");

    String emailValue = parts[0];
    String username = parts[1];
    String mobile = parts[2];
    String password = parts[3];

    // safety check again before insert
    if(authRepository.existsByEmail(emailValue)){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Email already registered");
    }

    if(authRepository.existsByMobileNumber(mobile)){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Mobile number already registered");
    }

    if(authRepository.existsByUsername(username)){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Username already taken");
    }

    User user = User.builder()
            .email(emailValue)
            .username(username)
            .mobileNumber(mobile)
            .password(password)
            .build();

    authRepository.save(user);

    redisTemplate.delete("REGISTER:"+email);

    return ResponseEntity.status(HttpStatus.CREATED)
            .body("User registered successfully");
}






    // ================= LOGIN =================
    public ResponseEntity<?> login(LoginDTO dto){

        User user = authRepository.findByEmail(dto.getEmail())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid credentials"
                        ));

        if(!passwordEncoder.matches(dto.getPassword(), user.getPassword())){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid credentials"
            );
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getRole().name()
        );

        redisTemplate.opsForValue().set(
                "auth:user:"+user.getId(),
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

        return ResponseEntity.ok("OTP sent");
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
                    .body("Invalid OTP");
        }

        User user = authRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        user.setPassword(passwordEncoder.encode(newPassword));

        return ResponseEntity.ok("Password reset successful");
    }

    //get profile
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