package com.example.glitchfame.Auth;
import com.example.glitchfame.Auth.DTO.LoginDTO;
import com.example.glitchfame.Auth.DTO.ProfileResponseDTO;
import com.example.glitchfame.Auth.DTO.RegisterDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    //REGISTER
  @PostMapping("/signup")
public ResponseEntity<String> register(@RequestBody RegisterDTO dto) {
    return authService.register(dto);
}



    //LOGIN
      @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
    return authService.login(dto);
}

   


   //PROFILE
   @GetMapping("/profile")
public ResponseEntity<ProfileResponseDTO> getProfile(Authentication authentication) {

    Long userId = Long.parseLong(authentication.getName());

    ProfileResponseDTO profile = authService.getProfile(userId);

    return ResponseEntity.ok(profile);
}



@DeleteMapping("/delete")
public ResponseEntity<String> deleteMyAccount() {

    authService.deleteMyAccount();

    return ResponseEntity.ok("Account deleted successfully");
}
}