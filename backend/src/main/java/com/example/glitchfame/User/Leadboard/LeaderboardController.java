package com.example.glitchfame.User.Leadboard;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.example.glitchfame.User.Leadboard.DTO.LeaderboardProjection;

import java.util.List;

@RestController
@RequestMapping("/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    // ============================================================
    // 🔥 TOP 3 OF ALL SEASONS
    // ============================================================

    @GetMapping
    public List<LeaderboardProjection> getTop3OfAllSeasons() {
        return leaderboardService.getTop3OfAllSeasons();
    }


    // ============================================================
// 🔥 PAST SEASONS LEADERBOARD (TOP 6)
// ============================================================

@GetMapping("/past-seasons")
public List<LeaderboardProjection> getPastSeasonsLeaderboard() {
    return leaderboardService.getPastSeasonsLeaderboard();
}




    // ============================================================
    // 🔥 TOP 3 OF ONE SEASON
    // ============================================================

    @GetMapping("/{seasonId}")
    public List<LeaderboardProjection> getTop3BySeason(
            @PathVariable Long seasonId
    ) {
        return leaderboardService.getTop3BySeason(seasonId);
    }
}