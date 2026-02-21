package com.example.glitchfame.Controller.AuthController;

import com.example.glitchfame.Service.AuthService.SignupService;
import com.example.glitchfame.dto.AuthDTO.OtpVerifyRequest;
import com.example.glitchfame.dto.AuthDTO.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class SignupController {

    private final SignupService signupService;

    // STEP 1 → Send OTP
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {

        signupService.initiateSignup(request);
        return ResponseEntity.ok("OTP sent to email");
    }

    // STEP 2 → Verify OTP
    @PostMapping("/verifysignup")
    public ResponseEntity<String> verifySignup(@RequestBody OtpVerifyRequest request) {

        signupService.verifyOtpAndCreateUser(
                request.getEmail(),
                request.getOtp()
        );

        return ResponseEntity.status(201)
                .body("User registered successfully");
    }
}