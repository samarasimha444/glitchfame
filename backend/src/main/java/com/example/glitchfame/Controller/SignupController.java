package com.example.glitchfame.Controller;

import com.example.glitchfame.Service.SignupService;
import com.example.glitchfame.dto.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class SignupController {

    private final SignupService signupService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {

        try {
            signupService.registerUser(request);
            return ResponseEntity.status(201).body("User registered successfully");

        } catch (RuntimeException ex) {

            switch (ex.getMessage()) {

                case "EMAIL_EXISTS":
                    return ResponseEntity.status(409).body("Email already exists");

                case "USERNAME_EXISTS":
                    return ResponseEntity.status(409).body("Username already exists");

                case "MOBILE_EXISTS":
                    return ResponseEntity.status(409).body("Mobile number already exists");

                default:
                    return ResponseEntity.status(500).body("Something went wrong");
            }
        }
    }
}