package com.example.glitchfame.Service.AdminService.AdminSeasonService;

import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.Repository.AdminRepository.AdminSeasonRepository.GetSeasonRepository;
import com.example.glitchfame.dto.AdminDTO.AdminSeasonDTO.GetSeasonDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetSeasonService {

    private final GetSeasonRepository seasonRepository;

    private static final int DEFAULT_PAGE_SIZE = 10;
    private static final int MAX_PAGE_SIZE = 50;

    public Page<GetSeasonDTO> getAllSeasons(int page, int size) {

        // 🔥 Defensive validation

        if (page < 0) {
            page = 0;
        }

        if (size <= 0) {
            size = DEFAULT_PAGE_SIZE;
        }

        if (size > MAX_PAGE_SIZE) {
            size = MAX_PAGE_SIZE;
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "id")
        );

        Page<Seasons> seasonsPage =
                seasonRepository.findByDeletedFalse(pageable);

        return seasonsPage.map(this::mapToDTO);
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

    //getseasonbyID
    public GetSeasonDTO getSeasonById(Long id) {

    Seasons season = seasonRepository
            .findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new RuntimeException("Season not found"));

    return mapToDTO(season);
}
}