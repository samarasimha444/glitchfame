package com.example.glitchfame.Service;
import com.example.glitchfame.dto.SeasonRequestDTO;
import com.example.glitchfame.Exceptions.BadRequestException;
import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.Repository.SeasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeasonService {

    private final SeasonRepository seasonRepository;

    public Seasons createSeason(SeasonRequestDTO dto) {

        LocalDateTime now = LocalDateTime.now();

        // 1️⃣ Duplicate name check
        if (seasonRepository.existsByNameAndDeletedFalse(dto.getName())) {
            throw new BadRequestException("Season name already exists");
        }

        // 2️⃣ Registration start must not be in past
        if (dto.getRegistrationStartDate().isBefore(now)) {
            throw new BadRequestException("Registration start cannot be in the past");
        }

        // 3️⃣ Registration start < Registration end
        if (dto.getRegistrationStartDate().isAfter(dto.getRegistrationEndDate())) {
            throw new BadRequestException("Registration start must be before registration end");
        }

        // 4️⃣ Registration must end before voting starts
        if (dto.getRegistrationEndDate().isAfter(dto.getVotingStartDate())) {
            throw new BadRequestException("Registration must end before voting starts");
        }

        // 5️⃣ Voting start < Voting end
        if (dto.getVotingStartDate().isAfter(dto.getVotingEndDate())) {
            throw new BadRequestException("Voting start must be before voting end");
        }

        // 6️⃣ Voting end must not be in past
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


    public List<Seasons> getAllSeasons() {
    return seasonRepository.findByDeletedFalse();
}
}
