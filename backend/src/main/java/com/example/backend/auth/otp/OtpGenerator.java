package com.example.backend.auth.otp;

import java.security.SecureRandom;

public class OtpGenerator {

    private static final SecureRandom random = new SecureRandom();

    public static String generate() {

        int number = 100000 + random.nextInt(900000);

        return String.valueOf(number);
    }
}