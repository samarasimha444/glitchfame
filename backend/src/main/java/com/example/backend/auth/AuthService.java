package com.example.backend.auth;

import com.example.backend.auth.dto.*;
import com.example.backend.auth.otp.OtpService;
import com.example.backend.auth.otp.OtpType;
import com.example.backend.config.security.jwt.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepo authRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService; // using your small 'o'

    // send register otp
    public String signup(Signup request) {

        if (authRepo.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already exists");

        if (authRepo.existsByUsername(request.getUsername()))
            throw new RuntimeException("Username already exists");

        if (request.getMobile() != null && authRepo.existsByMobile(request.getMobile()))
            throw new RuntimeException("Mobile already exists");

        // send OTP instead of creating user
        otpService.sendOtp(request.getEmail(), OtpType.REGISTER);

        return "OTP sent to email";
    }

    // verify otp and create user
    public String verifySignupOtp(Signup request, String otp) {

        otpService.verifyOtp(request.getEmail(), otp, OtpType.REGISTER);

        Auth user = new Auth();

        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        authRepo.save(user);

        return "User registered successfully";
    }

    // login
    public String login(Login request) {

        Auth user = authRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid password");

        return jwtUtil.generateToken(
                user.getAuthId(),
                user.getRole()
        );
    }



    //forgot password
    public String forgotPassword(String email) {
    Auth user = authRepo.findByEmail(email)
    .orElseThrow(() -> new RuntimeException("User not found"));

    otpService.sendOtp(user.getEmail(), OtpType.FORGOT_PASSWORD);

    return "OTP sent to email";
}


//verify  otp
public String verifyForgotOtp(String email, String otp) {

    otpService.verifyOtp(email, otp, OtpType.FORGOT_PASSWORD);

    return "OTP verified";
}




//reset password
public String resetPassword(String email, String newPassword) {
Auth user = authRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
 user.setPassword(passwordEncoder.encode(newPassword));
authRepo.save(user);

    return "Password reset successful";
}



//change-password
public String changePassword(String authId, String currentPassword, String newPassword) {

    Auth user = authRepo.findById(UUID.fromString(authId))
            .orElseThrow(() -> new RuntimeException("User not found"));
// check current password
    if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
        throw new RuntimeException("Current password is incorrect");
    }
// prevent same password reuse
    if (passwordEncoder.matches(newPassword, user.getPassword())) {
        throw new RuntimeException("New password cannot be same as current password");
    }
 // encode and update
    user.setPassword(passwordEncoder.encode(newPassword));

    authRepo.save(user);
return "Password changed successfully";

}




   //get user profile
  public Profile getProfile(UUID authId) {

        Auth user = authRepo.findById(authId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new Profile(
                user.getAuthId(),
                user.getEmail(),
                user.getMobile(),
                user.getUsername(),
                user.getCanVote(),
                user.getCanParticipate()
        );
    }





//delete account
public String deleteAccount(UUID authId) {
    Auth user = authRepo.findById(authId)
            .orElseThrow(() -> new RuntimeException("User not found")); // ensure user exists
authRepo.delete(user); // delete user
return "Account deleted successfully";
}
}