package com.example.glitchfame.User.Seasons;

import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import com.example.glitchfame.User.Seasons.DTO.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeasonsService {

    private final SeasonsRepository seasonsRepository;
    private final ExtractJwtData extractJwtData;

    // ================= GET LIVE SEASONS =================
    public List<SeasonsDTO> getLiveSeasons() {
        return seasonsRepository.findLiveSeasons(
                extractJwtData.getUserId()
        );
    }

    // ================= GET SEASON DETAILS =================
    public SeasonDetailsDTO getSeasonDetails(Long seasonId) {

        SeasonDetailsDTO season =
                seasonsRepository.findSeasonDetailsById(
                        seasonId,
                        extractJwtData.getUserId()
                );

        if (season == null) {
            throw new RuntimeException("Season not found");
        }

        return season;
    }

    // ================= SEARCH LIVE SEASONS =================
    public List<SeasonsByNameDTO> searchLiveSeasonsByName(String name) {

        if (name == null || name.trim().length() < 2) {
            return List.of();
        }

        return seasonsRepository.searchLiveByName(name.trim());
    }
}