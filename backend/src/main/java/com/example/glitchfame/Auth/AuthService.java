package com.example.glitchfame.Auth;
import com.example.glitchfame.Auth.DTO.LoginDTO;
import com.example.glitchfame.Auth.DTO.ProfileResponseDTO;
import com.example.glitchfame.Auth.DTO.RegisterDTO;
import com.example.glitchfame.Auth.DTO.UpdateProfileDTO;
import com.example.glitchfame.Auth.DTO.UserSearchProjection;
import com.example.glitchfame.Configuration.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import java.time.Duration;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import org.springframework.transaction.annotation.Transactional;
import com.example.glitchfame.Configuration.Cloudinary.CloudinaryService;
import java.util.List;





@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final ExtractJwtData extractJwtData;
    private final JwtUtil jwtUtil;
    private final CloudinaryService cloudinaryService;
    private final RedisTemplate<String, String> redisTemplate;



    // ========================= REGISTER =========================

    public ResponseEntity<String> register(RegisterDTO dto) {

        if (authRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already exists");
        }

        if (authRepository.existsByUsername(dto.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }

        if (authRepository.existsByMobileNumber(dto.getMobileNumber())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Mobile number already exists");
        }

        User user = User.builder()
                .email(dto.getEmail())
                .username(dto.getUsername())
                .mobileNumber(dto.getMobileNumber())
                .password(passwordEncoder.encode(dto.getPassword()))
                .build();

        authRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered successfully");
    }



    // ========================= LOGIN =========================
public ResponseEntity<?> login(LoginDTO dto) {
User user = authRepository.findByEmail(dto.getEmail())
            .orElse(null);
   if (user == null ||
        !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials");
    }
 String token = jwtUtil.generateToken(
            user.getId(),
            user.getRole().name());
String redisKey = "auth:user:" + user.getId();
redisTemplate.opsForValue().set(
            redisKey,
            token,
            Duration.ofHours(24) // match JWT expiry
    );

    return ResponseEntity.ok(token);
}

    // ========================= GET MY PROFILE =========================

    
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



    // ========================= UPDATE PROFILE =========================

    @Transactional
    public void updateProfile(UpdateProfileDTO dto) {

        Long userId = extractJwtData.getUserId();

        updateProfileInternal(userId, dto);
    }



    @Transactional
    @CacheEvict(value = "profiles", key = "#userId")
    public void updateProfileInternal(Long userId, UpdateProfileDTO dto) {

        User user = authRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ----- Email -----
        if (dto.getEmail() != null) {

            String newEmail = dto.getEmail().trim().toLowerCase();

            if (newEmail.isEmpty()) {
                throw new IllegalArgumentException("Email cannot be empty");
            }

            if (!newEmail.equalsIgnoreCase(user.getEmail())
                    && authRepository.existsByEmail(newEmail)) {
                throw new IllegalArgumentException("Email already exists");
            }

            user.setEmail(newEmail);
        }

        // ----- Username -----
        if (dto.getUsername() != null) {

            String newUsername = dto.getUsername().trim();

            if (newUsername.isEmpty()) {
                throw new IllegalArgumentException("Username cannot be empty");
            }

            if (!newUsername.equalsIgnoreCase(user.getUsername())
                    && authRepository.existsByUsername(newUsername)) {
                throw new IllegalArgumentException("Username already exists");
            }

            user.setUsername(newUsername);
        }

        // ----- Mobile -----
        if (dto.getMobileNumber() != null) {

            String newMobile = dto.getMobileNumber().trim();

            if (newMobile.isEmpty()) {
                throw new IllegalArgumentException("Mobile number cannot be empty");
            }

            if (!newMobile.equals(user.getMobileNumber())
                    && authRepository.existsByMobileNumber(newMobile)) {
                throw new IllegalArgumentException("Mobile number already exists");
            }

            user.setMobileNumber(newMobile);
        }

        // ----- Profile Image -----
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {

            String imageUrl;

            try {
                imageUrl = cloudinaryService.uploadImage(dto.getImage());
            } catch (Exception e) {
                throw new RuntimeException("Image upload failed");
            }

            user.setProfilePicture(imageUrl);
        }
    }



    // ========================= REMOVE PROFILE PICTURE =========================

    @Transactional
    public void removeProfilePicture() {

        Long userId = extractJwtData.getUserId();
         removeProfilePictureInternal(userId);
    }



    @Transactional
    @CacheEvict(value = "profiles", key = "#userId")
    public void removeProfilePictureInternal(Long userId) {
     String defaultUrl =
                "https://res.cloudinary.com/demo/image/upload/v1/default_profile.png";

        int updated = authRepository.resetProfilePicture(userId, defaultUrl);

        if (updated == 0) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            );
        }
    }



    // ========================= SEARCH USERS =========================

    public List<UserSearchProjection> searchUsers(
            String keyword,
            int page,
            int size) {

        if (keyword == null || keyword.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Search keyword is required"
            );
        }

        if (size > 20) {
            size = 20;
        }

        Pageable pageable = PageRequest.of(page, size);

        return authRepository.searchByUsername(keyword, pageable);
    }


// ========================= UPDATE PASSWORD =========================
@Transactional
public void updatePassword(String newPassword) {

    Long userId = extractJwtData.getUserId();

    if (newPassword == null || newPassword.trim().isEmpty()) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Password cannot be empty"
        );
    }

    if (newPassword.length() < 6) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Password must be at least 6 characters"
        );
    }

    User user = authRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            ));

    user.setPassword(passwordEncoder.encode(newPassword));
}























    // ========================= GET USER BY ID =========================

    public ProfileResponseDTO getUserProfileById(Long userId) {

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


// ========================= TOGGLE CAN VOTE (ADMIN) =========================
@Transactional
public void toggleCanVote(Long userId) {
    User user = authRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"));
    user.setCanVote(!user.isCanVote());
}


// ========================= TOGGLE CAN PARTICIPATE (ADMIN) =========================
@Transactional
public void toggleCanParticipate(Long userId) {
User user = authRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            ));

    user.setCanParticipate(!user.isCanParticipate());
}




















    // ========================= DELETE MY ACCOUNT =========================

    public void deleteMyAccount() {

        Long userId = extractJwtData.getUserId();

        if (!authRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        authRepository.deleteById(userId);
    }
}