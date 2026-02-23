package com.example.glitchfame.Service.AdminService.AdminSeasonService;

import com.example.glitchfame.Exceptions.BadRequestException;
import com.example.glitchfame.Configuration.redis.Cache.SeasonChangedEvent;
import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.Repository.AdminRepository.AdminSeasonRepository.CreateSeasonRepository;
import com.example.glitchfame.dto.AdminDTO.AdminSeasonDTO.SeasonRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateSeasonService {

    private final CreateSeasonRepository seasonRepository;
    private final ApplicationEventPublisher eventPublisher;

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

        LocalDateTime votingStartDate =
                dto.getVotingStartDate() != null
                        ? dto.getVotingStartDate()
                        : dto.getRegistrationEndDate();

        if (votingStartDate.isBefore(dto.getRegistrationEndDate())) {
            throw new BadRequestException("Voting cannot start before registration ends");
        }

        if (votingStartDate.isAfter(dto.getVotingEndDate())) {
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
                .votingStartDate(votingStartDate)
                .votingEndDate(dto.getVotingEndDate())
                .deleted(false)
                .build();

        Seasons savedSeason = seasonRepository.save(season);

        // 🔥 Publish event BEFORE return
        eventPublisher.publishEvent(new SeasonChangedEvent());

        return savedSeason;
    }
}