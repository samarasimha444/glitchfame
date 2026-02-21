package com.example.glitchfame.Service.AuthService;



import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final StringRedisTemplate redisTemplate;

    private static final Duration OTP_EXPIRY = Duration.ofMinutes(5);

    private static final String OTP_PREFIX = "otp:";

    // ================================
    // GENERATE OTP
    // ================================
    public String generateOtp() {
        int otp = 100000 + new Random().nextInt(900000);
        return String.valueOf(otp);
    }

    // ================================
    // STORE OTP
    // ================================
    public void storeOtp(String key, String otp) {
        redisTemplate.opsForValue()
                .set(OTP_PREFIX + key, otp, OTP_EXPIRY);
    }

    // ================================
    // VALIDATE OTP
    // ================================
    public boolean validateOtp(String key, String otp) {
        String storedOtp = redisTemplate.opsForValue()
                .get(OTP_PREFIX + key);

        return storedOtp != null && storedOtp.equals(otp);
    }

    // ================================
    // DELETE OTP
    // ================================
    public void deleteOtp(String key) {
        redisTemplate.delete(OTP_PREFIX + key);
    }
}