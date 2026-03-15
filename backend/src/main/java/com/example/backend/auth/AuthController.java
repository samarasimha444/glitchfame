package com.example.backend.auth;
import com.example.backend.auth.dto.Login;
import com.example.backend.auth.dto.Signup;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.example.backend.auth.dto.ChangePassword;
import org.springframework.security.core.Authentication;
import java.util.UUID;
import com.example.backend.auth.dto.Profile;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    // send register OTP
    @PostMapping("/signup")
    public String signup(@RequestBody Signup request) {
        return authService.signup(request);
    }

    // verify OTP and create user
    @PostMapping("/verify-signup")
    public String verifySignup(
            @RequestBody Signup request,
            @RequestParam String otp
    ) {
        return authService.verifySignupOtp(request, otp);
    }

    // login
    @PostMapping("/login")
    public String login(@RequestBody Login request) {
        return authService.login(request);
    }




    // forgot password → send OTP
@PostMapping("/forgot-password")
public String forgotPassword(@RequestParam String email) {
    return authService.forgotPassword(email);
}

// verify forgot password OTP
@PostMapping("/verify-forgot")
public String verifyForgotOtp(
        @RequestParam String email,
        @RequestParam String otp) {

    return authService.verifyForgotOtp(email, otp);
}

// reset password
@PostMapping("/reset-password")
public String resetPassword(
        @RequestParam String email,
        @RequestParam String newPassword) {

    return authService.resetPassword(email, newPassword);
}





@PostMapping("/change-password")
public String changePassword(
        Authentication authentication,
        @RequestBody ChangePassword request
) {
String authId = authentication.getName(); // extracted from JWT
return authService.changePassword(
            authId,
            request.getCurrentPassword(),
            request.getNewPassword());
}



@GetMapping("/profile")
    public Profile profile(Authentication authentication) {
       UUID authId = (UUID) authentication.getPrincipal(); // id set in JwtFilter
     return authService.getProfile(authId); // fetch profile
    }





     // delete account
@DeleteMapping("/delete-account")
public String deleteAccount(Authentication authentication) {
UUID authId = (UUID) authentication.getPrincipal(); // extracted from JWT
return authService.deleteAccount(authId);
    }
}