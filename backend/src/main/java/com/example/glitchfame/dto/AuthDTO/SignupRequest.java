package com.example.glitchfame.dto.AuthDTO;

import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String username;
    private String phoneNumber;
    private String password;
}