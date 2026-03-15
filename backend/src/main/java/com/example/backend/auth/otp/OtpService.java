package com.example.backend.auth.otp;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final StringRedisTemplate redis;
    private final EmailService emailService;

    private static final Duration OTP_TTL = Duration.ofMinutes(5);

    // send OTP
    public void sendOtp(String email, OtpType type) {

        String otp = OtpGenerator.generate();

        String key = buildKey(email, type);

        redis.opsForValue().set(key, otp, OTP_TTL);

        emailService.sendOtpEmail(email, otp, type.name());
    }

    // verify OTP
    public void verifyOtp(String email, String otp, OtpType type) {

        String key = buildKey(email, type);

        String storedOtp = redis.opsForValue().get(key);

        if(storedOtp == null)
            throw new RuntimeException("OTP expired");

        if(!storedOtp.equals(otp))
            throw new RuntimeException("Invalid OTP");

        redis.delete(key);
    }

    private String buildKey(String email, OtpType type) {

        return "otp:" + type.name().toLowerCase() + ":" + email;
    }
}