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

    // ================= GET SEASONS BY TYPE all/live/upcoming =================
    public List<SeasonsDTO> getSeasons(String type) {

        Long userId = extractJwtData.getUserId();

        if (type == null || type.isBlank()) {
            type = "all";
        }

        type = type.toLowerCase();

        if (!type.equals("all") && !type.equals("live") && !type.equals("upcoming")) {
            throw new IllegalArgumentException("Invalid season type");
        }

        return seasonsRepository.findSeasons(userId, type);
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