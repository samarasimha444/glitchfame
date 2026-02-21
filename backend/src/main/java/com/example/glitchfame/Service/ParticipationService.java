package com.example.glitchfame.Service;

import com.example.glitchfame.Entity.Participation;
import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.Entity.User;
import com.example.glitchfame.Repository.ParticipationRepository;
import com.example.glitchfame.Repository.SeasonRepository;
import com.example.glitchfame.Repository.LoginRepository;
import com.example.glitchfame.dto.ParticipationRequestDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParticipationService {

    private final ParticipationRepository participationRepository;
    private final SeasonRepository seasonRepository;
    private final LoginRepository loginRepository;

    public void createParticipation(ParticipationRequestDTO request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = loginRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

        Seasons season = seasonRepository.findById(request.getSeasonId())
                .orElseThrow(() -> new RuntimeException("SEASON_NOT_FOUND"));

        if (participationRepository.existsByUserAndSeason(user, season)) {
            throw new RuntimeException("ALREADY_PARTICIPATED");
        }

        Participation participation = Participation.builder()
                .user(user)
                .season(season)
                .age(request.getAge())
                .mobileNumber(request.getMobileNumber())
                .location(request.getLocation())
                .photoUrl(request.getPhotoUrl())
                .description(request.getDescription())
                .status(Participation.Status.PENDING)
                .build();

        participationRepository.save(participation);
    }
}