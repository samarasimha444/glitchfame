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

    /* leaders for one season */

    @GetMapping("/{seasonId}")
    public List<LeaderboardDTO> getSeasonLeaderboard(
            @PathVariable UUID seasonId
    ) {
        return leaderboardService.getTop3(seasonId);
    }

    /* leaders for all LIVE seasons */

    @GetMapping("/live")
    public Map<UUID, List<LeaderboardDTO>> getLiveSeasonLeaderboards() {

        return leaderboardService.getLiveSeasonLeaderboards();
    }
}