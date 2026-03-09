package com.example.glitchfame.Auth.Service;


import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import com.example.glitchfame.Auth.DTO.*;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final RedisTemplate<String,String> redisTemplate;
    private final EmailService emailService;

    private static final int MAX_ATTEMPTS = 5;

    public void sendOtp(String email, OtpType type){

        String otpKey = "OTP:" + type.name() + ":" + email;
        String limitKey = "OTP_LIMIT:" + email;

        // limit OTP requests (1 per minute)
        if(redisTemplate.hasKey(limitKey)){
            throw new RuntimeException("Please wait before requesting another OTP");
        }

        SecureRandom random = new SecureRandom();
        int otp = random.nextInt(900000) + 100000;

        redisTemplate.opsForValue().set(
                otpKey,
                String.valueOf(otp),
                Duration.ofMinutes(5)
        );

        // cooldown for next OTP request
        redisTemplate.opsForValue().set(
                limitKey,
                "1",
                Duration.ofSeconds(60)
        );

        String subject = "Your OTP Code";

        String html = "<h2>Your OTP is: " + otp + "</h2>";

        emailService.sendEmail(email, subject, html);
    }

    public boolean verifyOtp(String email,String otp,OtpType type){

        String otpKey = "OTP:" + type.name() + ":" + email;
        String attemptKey = "OTP_ATTEMPTS:" + email;

        String storedOtp = redisTemplate.opsForValue().get(otpKey);

        if(storedOtp == null){
            return false;
        }

        Integer attempts = 0;

        String attemptStr = redisTemplate.opsForValue().get(attemptKey);
        if(attemptStr != null){
            attempts = Integer.parseInt(attemptStr);
        }

        if(attempts >= MAX_ATTEMPTS){
            redisTemplate.delete(otpKey);
            throw new RuntimeException("Too many incorrect attempts. Request new OTP.");
        }

        boolean valid = storedOtp.equals(otp);

        if(valid){
            redisTemplate.delete(otpKey);
            redisTemplate.delete(attemptKey);
            return true;
        }

        redisTemplate.opsForValue().set(
                attemptKey,
                String.valueOf(attempts + 1),
                Duration.ofMinutes(5)
        );

        return false;
    }
}