package com.example.glitchfame.Admin.Users;


import com.example.glitchfame.Auth.AuthRepository;
import com.example.glitchfame.Auth.User;
import com.example.glitchfame.Auth.DTO.ProfileResponseDTO;


import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;



@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AuthRepository authRepository;
   

    
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



}