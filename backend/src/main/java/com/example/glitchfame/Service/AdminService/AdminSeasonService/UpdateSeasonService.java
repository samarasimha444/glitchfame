package com.example.glitchfame.Service.AdminService.AdminSeasonService;
import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.Repository.AdminRepository.AdminSeasonRepository.UpdateSeasonRepository;
import com.example.glitchfame.dto.AdminDTO.AdminSeasonDTO.UpdateSeasonDTO;
import com.example.glitchfame.dto.AdminDTO.AdminSeasonDTO.GetSeasonDTO;
import com.example.glitchfame.Exceptions.BadRequestException;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UpdateSeasonService {

    private final UpdateSeasonRepository seasonRepository;

    public GetSeasonDTO updateSeason(Long id, UpdateSeasonDTO dto) {

        Seasons season = seasonRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Season not found"));

        // 🔴 Name uniqueness validation
        if (seasonRepository
                .existsByNameAndDeletedFalseAndIdNot(dto.getName(), id)) {

            throw new BadRequestException(
                    "Season name already exists. Try using a different one.");
        }

        LocalDateTime now = LocalDateTime.now();

        // 🔴 Date validations
        if (dto.getRegistrationStartDate().isBefore(now)) {
            throw new BadRequestException(
                    "Registration start cannot be in the past.");
        }

        if (dto.getRegistrationStartDate()
                .isAfter(dto.getRegistrationEndDate())) {
            throw new BadRequestException(
                    "Registration start must be before registration end.");
        }

        if (dto.getVotingStartDate()
                .isBefore(dto.getRegistrationEndDate())) {
            throw new BadRequestException(
                    "Voting must start after registration ends.");
        }

        if (dto.getVotingStartDate()
                .isAfter(dto.getVotingEndDate())) {
            throw new BadRequestException(
                    "Voting start must be before voting end.");
        }

        if (dto.getPrizeMoney()
                .compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException(
                    "Prize money must be greater than zero.");
        }

        // ✅ Apply updates
        season.setName(dto.getName());
        season.setPrizeMoney(dto.getPrizeMoney());
        season.setRegistrationStartDate(dto.getRegistrationStartDate());
        season.setRegistrationEndDate(dto.getRegistrationEndDate());
        season.setVotingStartDate(dto.getVotingStartDate());
        season.setVotingEndDate(dto.getVotingEndDate());

        seasonRepository.save(season);

        return mapToDTO(season);
    }

    private GetSeasonDTO mapToDTO(Seasons season) {
        return GetSeasonDTO.builder()
                .id(season.getId())
                .name(season.getName())
                .prizeMoney(season.getPrizeMoney())
                .registrationStartDate(season.getRegistrationStartDate())
                .registrationEndDate(season.getRegistrationEndDate())
                .votingStartDate(season.getVotingStartDate())
                .votingEndDate(season.getVotingEndDate())
                .build();
    }
}