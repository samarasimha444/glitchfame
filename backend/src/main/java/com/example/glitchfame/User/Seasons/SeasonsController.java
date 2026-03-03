package com.example.glitchfame.User.Seasons;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.glitchfame.User.Seasons.DTO.*;

import java.util.List;

@RestController
@RequestMapping("/seasons")
@RequiredArgsConstructor
public class SeasonsController {

    private final SeasonsService seasonsService;

    // ================= GET LIVE SEASONS =================
    @GetMapping
    public ResponseEntity<List<SeasonsDTO>> getLiveSeasons() {
        return ResponseEntity.ok(
                seasonsService.getLiveSeasons()
        );
    }

    // ================= GET SEASON DETAILS =================
    @GetMapping("/{seasonId}")
    public ResponseEntity<SeasonDetailsDTO> getSeasonDetails(
            @PathVariable Long seasonId) {

        return ResponseEntity.ok(
                seasonsService.getSeasonDetails(seasonId)
        );
    }

    // ================= SEARCH LIVE SEASONS =================
    @GetMapping("/search")
    public ResponseEntity<List<SeasonsByNameDTO>> searchSeasons(
            @RequestParam String name) {

        return ResponseEntity.ok(
                seasonsService.searchLiveSeasonsByName(name)
        );
    }
}