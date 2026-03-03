package com.example.glitchfame.Admin.Users;

import com.example.glitchfame.Admin.Seasons.DTO.SeasonFormDTO;
import com.example.glitchfame.Admin.Seasons.DTO.UpdateSeasonDTO;
import com.example.glitchfame.Auth.AuthRepository;
import com.example.glitchfame.Auth.User;
import com.example.glitchfame.Auth.DTO.ProfileResponseDTO;
import com.example.glitchfame.Configuration.Cloudinary.CloudinaryService;
import com.example.glitchfame.User.Seasons.*;
import com.example.glitchfame.User.Seasons.DTO.*;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AuthRepository authRepository;
    private final SeasonsRepository seasonsRepository;
    private final CloudinaryService cloudinaryService;

    
   //get user profile by id 
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


    //toggle can vote
    @Transactional
    @CacheEvict(value = "profiles", key = "#userId")
    public void toggleCanVote(Long userId) {

        User user = authRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setCanVote(!user.isCanVote());
    }



    //toggle can participate
    @Transactional
    @CacheEvict(value = "profiles", key = "#userId")
    public void toggleCanParticipate(Long userId) {

        User user = authRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setCanParticipate(!user.isCanParticipate());
    }


    //delete user by id
    @Transactional
    public void deleteUserByAdmin(Long userId) {

        if (!authRepository.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            );
        }

        authRepository.deleteById(userId);
    }

 



// ================= SEASON ADMIN CONTROLS ===========================================



    //create season
    @Transactional
    public String createSeason(SeasonFormDTO dto) {

        LocalDateTime now = LocalDateTime.now();
        String name = dto.getName().trim();

        if (seasonsRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Season name already exists");
        }

        if (dto.getRegistrationStartDate().isBefore(now)) {
            throw new IllegalArgumentException("Registration start date cannot be in the past");
        }

        if (dto.getRegistrationStartDate().isAfter(dto.getRegistrationEndDate())) {
            throw new IllegalArgumentException("Registration end must be after registration start");
        }

        if (dto.getRegistrationEndDate().isAfter(dto.getVotingStartDate())) {
            throw new IllegalArgumentException("Voting must start after registration ends");
        }

        if (dto.getVotingStartDate().isAfter(dto.getVotingEndDate())) {
            throw new IllegalArgumentException("Voting end must be after voting start");
        }

        String imageUrl;
        try {
            imageUrl = cloudinaryService.uploadImage(dto.getImage());
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed");
        }

        Seasons season = Seasons.builder()
                .name(name)
                .prizeMoney(dto.getPrizeMoney())
                .registrationStartDate(dto.getRegistrationStartDate())
                .registrationEndDate(dto.getRegistrationEndDate())
                .votingStartDate(dto.getVotingStartDate())
                .votingEndDate(dto.getVotingEndDate())
                .photoUrl(imageUrl)
                .build();

        seasonsRepository.save(season);

        return "Season created successfully";
    }



//delete season
    @Transactional
    public String deleteSeasonById(Long id) {
        Seasons season = seasonsRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Season not found"));
        seasonsRepository.delete(season);

        return "Season deleted successfully";
    }





//update season
@Transactional
public String updateSeason(Long id, UpdateSeasonDTO dto) {
Seasons season = seasonsRepository.findById(id)
            .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Season not found"));

    // ================= NAME =================
    if (dto.getName() != null) {

        String newName = dto.getName().trim();
        if (newName.isEmpty()) {
            throw new IllegalArgumentException("Season name cannot be empty");
        }
        if (seasonsRepository.existsByNameIgnoreCaseAndIdNot(newName, id)) {
            throw new IllegalArgumentException("Season name already exists");
        }

        season.setName(newName);
    }

    // ================= PRIZE MONEY =================
    if (dto.getPrizeMoney() != null) {
        if (dto.getPrizeMoney().signum() <= 0) {
            throw new IllegalArgumentException("Prize money must be positive");
        }
        season.setPrizeMoney(dto.getPrizeMoney());
    }

    // ================= LOCK FLAGS =================
    if (dto.getVoteLock() != null) {
        season.setVoteLock(dto.getVoteLock());}
        if (dto.getParticipationLock() != null) {
        season.setParticipationLock(dto.getParticipationLock());}

        if (dto.getSeasonLock() != null) {
        season.setSeasonLock(dto.getSeasonLock());
    }

    // ================= TIMELINE SAFE PATCH =================
    LocalDateTime regStart = dto.getRegistrationStartDate() != null
            ? dto.getRegistrationStartDate()
            : season.getRegistrationStartDate();

    LocalDateTime regEnd = dto.getRegistrationEndDate() != null
            ? dto.getRegistrationEndDate()
            : season.getRegistrationEndDate();

    LocalDateTime voteStart = dto.getVotingStartDate() != null
            ? dto.getVotingStartDate()
            : season.getVotingStartDate();

    LocalDateTime voteEnd = dto.getVotingEndDate() != null
            ? dto.getVotingEndDate()
            : season.getVotingEndDate();

    if (regStart.isAfter(regEnd)) {
        throw new IllegalArgumentException("Registration end must be after registration start");
    }

    if (regEnd.isAfter(voteStart)) {
        throw new IllegalArgumentException("Voting must start after registration ends");
    }

    if (voteStart.isAfter(voteEnd)) {
        throw new IllegalArgumentException("Voting end must be after voting start");
    }

    season.setRegistrationStartDate(regStart);
    season.setRegistrationEndDate(regEnd);
    season.setVotingStartDate(voteStart);
    season.setVotingEndDate(voteEnd);

    // ================= IMAGE UPDATE =================
    if (dto.getImage() != null && !dto.getImage().isEmpty()) {
        try {
            String imageUrl = cloudinaryService.uploadImage(dto.getImage());
            season.setPhotoUrl(imageUrl);
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed");
        }
    }

    return "Season updated successfully";
}

















}