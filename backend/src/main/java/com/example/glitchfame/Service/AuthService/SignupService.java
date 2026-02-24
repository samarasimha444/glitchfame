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
        String username = request.getUsername().trim();
        String mobile = request.getPhoneNumber().trim();

        // Check only ACTIVE users
        if (signupRepository.existsByEmailAndDeletedFalse(email)) {
            throw new ConflictException("Email already exists");
        }

        if (signupRepository.existsByUsernameAndDeletedFalse(username)) {
            throw new ConflictException("Username already exists");
        }

        if (signupRepository.existsByMobileNumberAndDeletedFalse(mobile)) {
            throw new ConflictException("Mobile number already exists");
        }

        // Encode password BEFORE storing in Redis
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        request.setEmail(email);
        request.setUsername(username);
        request.setPhoneNumber(mobile);

        try {
            String signupData = objectMapper.writeValueAsString(request);

            redisTemplate.opsForValue().set(
                    SIGNUP_PREFIX + email,
                    signupData,
                    SIGNUP_EXPIRY
            );

        } catch (Exception e) {
            throw new BadRequestException("Unable to process signup");
        }

        String otp = otpService.generateOtp();
        otpService.storeOtp(email, otp);

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

            // FINAL safety check (race condition protection)
            if (signupRepository.existsByEmailAndDeletedFalse(request.getEmail())) {
                throw new ConflictException("Email already registered");
            }

            if (signupRepository.existsByUsernameAndDeletedFalse(request.getUsername())) {
                throw new ConflictException("Username already registered");
            }

            if (signupRepository.existsByMobileNumberAndDeletedFalse(request.getPhoneNumber())) {
                throw new ConflictException("Mobile number already registered");
            }

            User user = User.builder()
                    .email(request.getEmail())
                    .username(request.getUsername())
                    .mobileNumber(request.getPhoneNumber())
                    .password(request.getPassword()) // already encoded
                    .role(User.Role.USER)
                    .deleted(false)  // IMPORTANT
                    .build();

            // Clean Redis
            otpService.deleteOtp(email);
            redisTemplate.delete(SIGNUP_PREFIX + email);

            return signupRepository.save(user);

        } catch (ConflictException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("User creation failed");
        }
    }
}