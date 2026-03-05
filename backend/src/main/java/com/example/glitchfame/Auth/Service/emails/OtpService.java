package com.example.glitchfame.Auth.Service.emails;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.RedisTemplate;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final RedisTemplate<String,String> redisTemplate;
    private final EmailService emailService;

    // ================= OTP GENERATOR =================
    private String generateOtp() {
        return String.valueOf((int)((Math.random() * 900000) + 100000));
    }

    // ================= SEND OTP =================
    public void sendOtp(String email, OtpType type){

        String otp = generateOtp();

        String key = "OTP:" + type.name() + ":" + email;

        redisTemplate.opsForValue().set(
                key,
                otp,
                Duration.ofMinutes(5)
        );

        String subject;
        String message;

        switch (type) {

            case REGISTER:
                subject = "GlitchFame Registration OTP";
                message = "Your registration OTP is: " + otp + "\nValid for 5 minutes.";
                break;

            case FORGOT_PASSWORD:
                subject = "GlitchFame Forgot Password OTP";
                message = "Your password recovery OTP is: " + otp + "\nValid for 5 minutes.";
                break;

            case RESET_PASSWORD:
                subject = "GlitchFame Reset Password OTP";
                message = "Your password reset OTP is: " + otp + "\nValid for 5 minutes.";
                break;

            default:
                throw new RuntimeException("Invalid OTP type");
        }

        emailService.sendEmail(email, subject, message);
    }

    // ================= VERIFY OTP =================
    public boolean verifyOtp(String email, String otp, OtpType type){

        String key = "OTP:" + type.name() + ":" + email;

        String storedOtp = redisTemplate.opsForValue().get(key);

        if(storedOtp == null) return false;

        if(!storedOtp.equals(otp)) return false;

        redisTemplate.delete(key);

        return true;
    }
}