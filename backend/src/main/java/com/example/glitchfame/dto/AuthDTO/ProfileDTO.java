package com.example.glitchfame.dto.AuthDTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDTO {

    private Long id;
    private String username;
    private String email;
    private String mobileNumber;
    private String role;
}