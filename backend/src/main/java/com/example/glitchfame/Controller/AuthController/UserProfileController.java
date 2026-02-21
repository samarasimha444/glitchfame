package com.example.glitchfame.Controller.AuthController;

import org.springframework.web.bind.annotation.*;

import com.example.glitchfame.Service.AuthService.ProfileService;
import com.example.glitchfame.dto.AuthDTO.ProfileDTO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserProfileController {

    private final ProfileService userService;

    @GetMapping("/profile")
    public ProfileDTO getProfile() {
        return userService.getLoggedInUserProfile();
    }

    
}