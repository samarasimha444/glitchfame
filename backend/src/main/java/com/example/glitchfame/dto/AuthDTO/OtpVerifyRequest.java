package com.example.glitchfame.dto.AuthDTO;
import lombok.Data;

@Data
public class OtpVerifyRequest {
    private String email;
    private String otp;
}