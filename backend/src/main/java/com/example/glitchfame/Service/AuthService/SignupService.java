package com.example.glitchfame.Service.AuthService;

import com.example.glitchfame.Entity.User;
import com.example.glitchfame.Exceptions.BadRequestException;
import com.example.glitchfame.Exceptions.ConflictException;
import com.example.glitchfame.Repository.AuthRepository.SignupRepository;
import com.example.glitchfame.dto.AuthDTO.SignupRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class SignupService {

    private final SignupRepository signupRepository;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redisTemplate;
    private final EmailService emailService;
    private final OtpService otpService;
    private final ObjectMapper objectMapper;

    private static final Duration SIGNUP_EXPIRY = Duration.ofMinutes(5);
    private static final String SIGNUP_PREFIX = "signup:data:";

    // ================================
    // STEP 1 → INITIATE SIGNUP
    // ================================
    public void initiateSignup(SignupRequest request) {

        String email = request.getEmail().toLowerCase().trim();

        // Duplicate checks
        if (signupRepository.existsByEmail(email)) {
            throw new ConflictException("Email already exists");
        }

        if (signupRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Username already exists");
        }

        if (signupRepository.existsByMobileNumber(request.getPhoneNumber())) {
            throw new ConflictException("Mobile number already exists");
        }

        // Encode password BEFORE storing
        request.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        request.setEmail(email);

        try {
            String signupData =
                    objectMapper.writeValueAsString(request);

            // Store signup data in Redis
            redisTemplate.opsForValue().set(
                    SIGNUP_PREFIX + email,
                    signupData,
                    SIGNUP_EXPIRY
            );

        } catch (Exception e) {
            throw new BadRequestException("Unable to process signup");
        }

        // Generate & store OTP
        String otp = otpService.generateOtp();
        otpService.storeOtp(email, otp);

        // Send email
        emailService.sendHtmlEmail(
                email,
                "GlitchFame Signup OTP",
                "<h2>Your OTP is: " + otp + "</h2><p>Valid for 5 minutes.</p>"
        );
    }

    // ================================
    // STEP 2 → VERIFY OTP & CREATE USER
    // ================================
    public User verifyOtpAndCreateUser(String email, String otp) {

        email = email.toLowerCase().trim();

        // Validate OTP
        if (!otpService.validateOtp(email, otp)) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        String signupData = redisTemplate.opsForValue()
                .get(SIGNUP_PREFIX + email);

        if (signupData == null) {
            throw new BadRequestException("Signup session expired");
        }

        try {
            SignupRequest request =
                    objectMapper.readValue(signupData, SignupRequest.class);

            User user = User.builder()
                    .email(request.getEmail())
                    .username(request.getUsername())
                    .mobileNumber(request.getPhoneNumber())
                    .password(request.getPassword()) // already encoded
                    .role(User.Role.USER)
                    .build();

            // Clean Redis
            otpService.deleteOtp(email);
            redisTemplate.delete(SIGNUP_PREFIX + email);

            return signupRepository.save(user);

        } catch (Exception e) {
            throw new BadRequestException("User creation failed");
        }
    }
}