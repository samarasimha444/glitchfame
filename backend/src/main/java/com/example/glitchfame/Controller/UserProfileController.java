package com.example.glitchfame.Controller;

import org.springframework.web.bind.annotation.*;

import com.example.glitchfame.dto.UserProfileDTO;
import com.example.glitchfame.Service.UserProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userService;

    @GetMapping("/profile")
    public UserProfileDTO getProfile() {
        return userService.getLoggedInUserProfile();
    }
}