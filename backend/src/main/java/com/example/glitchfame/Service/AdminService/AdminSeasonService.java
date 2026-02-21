package com.example.glitchfame.Service.AdminService;

import com.example.glitchfame.Exceptions.BadRequestException;
import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.Repository.UserRepository.SeasonRepository;
import com.example.glitchfame.dto.AdminDTO.SeasonRequestDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminSeasonService {

    private final SeasonRepository seasonRepository;

    public Seasons createSeason(SeasonRequestDTO dto) {

        LocalDateTime now = LocalDateTime.now();

        if (seasonRepository.existsByNameAndDeletedFalse(dto.getName())) {
            throw new BadRequestException("Season name already exists");
        }

        if (dto.getRegistrationStartDate().isBefore(now)) {
            throw new BadRequestException("Registration start cannot be in the past");
        }

        if (dto.getRegistrationStartDate().isAfter(dto.getRegistrationEndDate())) {
            throw new BadRequestException("Registration start must be before registration end");
        }

        if (dto.getRegistrationEndDate().isAfter(dto.getVotingStartDate())) {
            throw new BadRequestException("Registration must end before voting starts");
        }

        if (dto.getVotingStartDate().isAfter(dto.getVotingEndDate())) {
            throw new BadRequestException("Voting start must be before voting end");
        }

        if (dto.getVotingEndDate().isBefore(now)) {
            throw new BadRequestException("Voting end cannot be in the past");
        }

        Seasons season = Seasons.builder()
                .name(dto.getName())
                .prizeMoney(dto.getPrizeMoney())
                .registrationStartDate(dto.getRegistrationStartDate())
                .registrationEndDate(dto.getRegistrationEndDate())
                .votingStartDate(dto.getVotingStartDate())
                .votingEndDate(dto.getVotingEndDate())
                .deleted(false)
                .build();

        return seasonRepository.save(season);
    }
}