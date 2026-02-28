package com.example.glitchfame.Auth;
import com.example.glitchfame.Auth.DTO.LoginDTO;
import com.example.glitchfame.Auth.DTO.ProfileResponseDTO;
import com.example.glitchfame.Auth.DTO.RegisterDTO;
import com.example.glitchfame.Auth.DTO.UpdateProfileDTO;
import com.example.glitchfame.Auth.DTO.UserSearchProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import org.springframework.http.MediaType;
import java.util.List;





@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final ExtractJwtData jwtService;
  

     //REGISTER
    @PostMapping("/signup")
    public ResponseEntity<String> register(@RequestBody RegisterDTO dto) {
    return authService.register(dto);}



    //LOGIN
      @PostMapping("/login")
      public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
    return authService.login(dto);}

   
    //PROFILE
    @GetMapping("/profile/me")
    public ResponseEntity<ProfileResponseDTO> getProfile(Authentication authentication) {
    Long userId = Long.parseLong(authentication.getName());
    ProfileResponseDTO profile = authService.getProfile(userId);
    return ResponseEntity.ok(profile);
}

// UPDATE PROFILE
@PatchMapping(value = "/profile/update",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<String> updateProfile(
        @ModelAttribute UpdateProfileDTO dto) {

    authService.updateProfile(dto);
    return ResponseEntity.ok("Profile updated successfully");
}

 
// REMOVE PROFILE PICTURE
@PatchMapping("/profile-picture/remove")
public ResponseEntity<String> removeProfilePicture() {
     authService.removeProfilePicture();
    return ResponseEntity.ok("Profile picture removed");
}





    //SEARCH USERS
    @GetMapping("profile/name")
    public List<UserSearchProjection> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {     return authService.searchUsers(keyword, page, size);

    }



    //get user profile by id (for admin or public viewing)
     @GetMapping("/profile/{id}")
    public ProfileResponseDTO getUserProfile(@PathVariable Long id) {
        return authService.getUserProfileById(id);
    }




    //DELETE ACCOUNT
    @DeleteMapping("/profile/delete")
    public ResponseEntity<String> deleteMyAccount() {
    authService.deleteMyAccount();
    return ResponseEntity.ok("Account deleted successfully");
}
}