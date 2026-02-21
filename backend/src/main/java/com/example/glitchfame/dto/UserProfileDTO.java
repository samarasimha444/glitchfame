package com.example.glitchfame.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDTO {

    private Long id;
    private String username;
    private String email;
    private String mobileNumber;
    private String role;
}