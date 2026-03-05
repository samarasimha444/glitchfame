package com.example.glitchfame.Auth;
import com.example.glitchfame.Auth.Service.AuthService;
import com.example.glitchfame.Auth.DTO.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ================= REGISTER =================
    @PostMapping("/signup")
    public ResponseEntity<String> register(@RequestBody RegisterDTO dto) {
        return authService.register(dto);
    }

    // ================= VERIFY REGISTER OTP =================
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @RequestParam String email,
            @RequestParam String otp) {

        return authService.verifyOtp(email, otp);
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        return authService.login(dto);
    }

    // ================= FORGOT PASSWORD =================
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestParam String email) {

        return authService.forgotPassword(email);
    }

    // ================= RESET PASSWORD =================
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword) {

        return authService.resetPassword(email, otp, newPassword);
    }

    // ================= GET MY PROFILE =================
    @GetMapping("/profile/me")
    public ResponseEntity<ProfileResponseDTO> getProfile(
            Authentication authentication) {

        Long userId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(authService.getProfile(userId));
    }

    // ================= DELETE MY ACCOUNT =================
    @DeleteMapping("/profile/delete")
    public ResponseEntity<String> deleteMyAccount() {

        authService.deleteMyAccount();

        return ResponseEntity.ok("Account deleted successfully");
    }
}