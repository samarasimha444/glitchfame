package com.example.glitchfame.Auth.DTO;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateProfileDTO {

    private String email;
    private String username;
    private String mobileNumber;
    private MultipartFile image; // optional profile picture
}