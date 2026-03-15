package com.example.backend.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Login {

    private String email;
    private String password;
}