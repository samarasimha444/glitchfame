package com.example.glitchfame.Service.UserService;

import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.Repository.UserRepository.SeasonRepository.SeasonRepository;
import com.example.glitchfame.dto.UserDTO.SeasonDashboardDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserSeasonService {

    private final SeasonRepository seasonRepository;

    @Cacheable(value = "dashboardSeasons")
    public List<SeasonDashboardDTO> getAllSeasons() {

        LocalDateTime now = LocalDateTime.now();

        return seasonRepository
                .findByDeletedFalseOrderByRegistrationStartDateDesc()
                .stream()
                .map(season -> mapToDTO(season, now))
                .collect(Collectors.toList());
    }

    private SeasonDashboardDTO mapToDTO(Seasons season, LocalDateTime now) {

        String status;

        if (now.isBefore(season.getRegistrationStartDate())) {
            status = "UPCOMING";
        } else if (now.isAfter(season.getVotingEndDate())) {
            status = "COMPLETED";
        } else {
            status = "LIVE";
        }

        return SeasonDashboardDTO.builder()
                .id(season.getId())
                .name(season.getName())
                .prizeMoney(season.getPrizeMoney())
                .registrationStartDate(season.getRegistrationStartDate())
                .registrationEndDate(season.getRegistrationEndDate())
                .votingStartDate(season.getVotingStartDate())
                .votingEndDate(season.getVotingEndDate())
                .winnerId(season.getWinnerId())
                .status(status)
                .build();
    }
}