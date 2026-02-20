package com.example.glitchfame.Controller;

import com.example.glitchfame.Service.UserService;
import com.example.glitchfame.dto.LoginRequest;
import com.example.glitchfame.dto.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            userService.registerUser(request);
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

   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {

    try {
        String token = userService.loginUser(request);
        return ResponseEntity.ok(token);

    } catch (RuntimeException ex) {

        switch (ex.getMessage()) {

            case "INVALID_EMAIL":
                return ResponseEntity.status(404).body("Email not found");

            case "INVALID_PASSWORD":
                return ResponseEntity.status(401).body("Incorrect password");

            default:
                return ResponseEntity.status(500).body("Something went wrong");
        }
    }
}}