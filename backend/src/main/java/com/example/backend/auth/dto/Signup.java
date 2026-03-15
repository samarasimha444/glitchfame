package com.example.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Signup {

    @Email
    @NotBlank
    private String email; // user email

    @NotBlank
    @Size(min = 3, max = 100)
    private String username; // unique username

    @Size(max = 20)
    private String mobile; // optional mobile

    @NotBlank
    @Size(min = 6, max = 255)
    private String password; // raw password (will be hashed)
}