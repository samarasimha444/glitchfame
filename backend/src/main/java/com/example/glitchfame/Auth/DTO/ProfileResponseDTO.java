package com.example.glitchfame.Auth.DTO;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileResponseDTO   implements Serializable {

    
    private Long id;
    private String username;
    private String email;
    private String mobileNumber;
    private String role;
}