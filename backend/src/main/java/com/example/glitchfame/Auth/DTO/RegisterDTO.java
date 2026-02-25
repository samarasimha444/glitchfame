package com.example.glitchfame.Auth.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterDTO {

    private String email;
    private String username;
    private String mobileNumber;
    private String password;
}