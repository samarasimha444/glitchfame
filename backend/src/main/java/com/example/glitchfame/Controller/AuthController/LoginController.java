package com.example.glitchfame.Controller.AuthController;

import com.example.glitchfame.Service.AuthService.LoginService;
import com.example.glitchfame.dto.AuthDTO.LoginRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {
            String token = loginService.loginUser(request);
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
    }
}