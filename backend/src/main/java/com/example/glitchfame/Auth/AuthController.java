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



    // LOGIN
    @PostMapping("/login")
    public String login(@RequestBody LoginDTO dto) {
        return authService.login(dto);
    }

   

    // Get user profile
   @GetMapping("/profile")
public ProfileResponseDTO getProfile(Authentication authentication) {

    Long userId = Long.parseLong(authentication.getName());
     return authService.getProfile(userId);
}
}