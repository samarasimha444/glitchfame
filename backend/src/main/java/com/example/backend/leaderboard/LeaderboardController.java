package com.example.backend.leaderboard;

import com.example.backend.leaderboard.dto.LeaderboardDTO;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    // ================= SINGLE SEASON =================
    @GetMapping("/{seasonId}")
    public List<LeaderboardDTO> getTop3Leaderboard(
            @PathVariable UUID seasonId
    ) {
        return leaderboardService.getTop3(seasonId);
    }

    // ================= LIVE SEASONS =================
    @GetMapping("/live")
    public Map<UUID, List<LeaderboardDTO>> getLiveSeasonLeaderboards(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return leaderboardService.getLiveSeasonLeaderboards(limit);
    }
}