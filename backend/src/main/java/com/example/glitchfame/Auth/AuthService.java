package com.example.glitchfame.Auth;
import com.example.glitchfame.Auth.DTO.LoginDTO;
import com.example.glitchfame.Auth.DTO.ProfileResponseDTO;
import com.example.glitchfame.Auth.DTO.RegisterDTO;
import com.example.glitchfame.Auth.DTO.UserSearchProjection;
import com.example.glitchfame.Configuration.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.http.MediaType;
import com.example.glitchfame.Configuration.Cloudinary.CloudinaryService;
import java.util.List;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final ExtractJwtData ExtractJwtData;
    private final JwtUtil jwtUtil;
        private final CloudinaryService cloudinaryService;



    //REGISTER
   public ResponseEntity<String> register(RegisterDTO dto) {

    if (authRepository.existsByEmail(dto.getEmail())) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("Email already exists");
    }

    if (authRepository.existsByUsername(dto.getUsername())) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("Username already exists");
    }

    if (authRepository.existsByMobileNumber(dto.getMobileNumber())) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("Mobile number already exists");
    }

    User user = User.builder()
            .email(dto.getEmail())
            .username(dto.getUsername())
            .mobileNumber(dto.getMobileNumber())
            .password(passwordEncoder.encode(dto.getPassword()))
            .build();

    authRepository.save(user);

    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body("User registered successfully");
}





//login
public ResponseEntity<?> login(LoginDTO dto) {

    User user = authRepository.findByEmail(dto.getEmail())
            .orElse(null);

    if (user == null) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials");
    }

    if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials");
    }

    String token = jwtUtil.generateToken(
            user.getId(),
            user.getRole().name()
    );

    return ResponseEntity.ok(token);
}




//profile
@Cacheable(value = "profiles", key = "#userId")
public ProfileResponseDTO getProfile(Long userId) {

    User user = authRepository.findById(userId)
            .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "User not found"
                    )
            );
        return ProfileResponseDTO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .mobileNumber(user.getMobileNumber())
            .role(user.getRole().name())
            .canVote(user.isCanVote())
            .canParticipate(user.isCanParticipate())
            .profilePicture(user.getProfilePicture())
            .build();
}





//update profile picture
  @Transactional
@CacheEvict(value = "profiles", key = "#userId")
public void updateProfilePicture(Long userId, MultipartFile file) {
if (file.isEmpty()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
    }

    String imageUrl = cloudinaryService.uploadImage(file); // you implement this

    int updated = authRepository.updateProfilePicture(userId, imageUrl);

    if (updated == 0) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }
}





//remove profile picture
@Transactional
@CacheEvict(value = "profiles", key = "#userId")
public void removeProfilePicture(Long userId) {

    String defaultUrl =
        "https://res.cloudinary.com/demo/image/upload/v1/default_profile.png";

    int updated = authRepository.resetProfilePicture(userId, defaultUrl);

    if (updated == 0) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }
}


        public List<UserSearchProjection> searchUsers(String keyword, int page, int size) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Search keyword is required"
            );}
        if (size > 20) { // hard limit
            size = 20;
        }
        Pageable pageable = PageRequest.of(page, size);
        return authRepository.searchByUsername(keyword, pageable);
    }


   


        //get user profile by id (for other users to view)
public ProfileResponseDTO getUserProfileById(Long userId) {
User user = authRepository.findById(userId)
            .orElseThrow(() ->
        new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found"));
        return ProfileResponseDTO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .mobileNumber(user.getMobileNumber())
            .role(user.getRole().name())
            .canVote(user.isCanVote())
            .canParticipate(user.isCanParticipate())
            .profilePicture(user.getProfilePicture())
            .build();
}


















//delete user   
        public void deleteMyAccount() {
        Long userId = ExtractJwtData.getUserId();

        if (!authRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        authRepository.deleteById(userId);
    }
}
