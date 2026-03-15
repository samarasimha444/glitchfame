package com.example.backend.leaderboard;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.redis.core.ZSetOperations;

import java.util.*;
import java.util.UUID;

@RestController
@RequestMapping("/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    /* leaderboard for a single season */

    @GetMapping("/{seasonId}")
    public Set<ZSetOperations.TypedTuple<String>> getSeasonLeaderboard(
            @PathVariable UUID seasonId
    ) {
        return leaderboardService.getTop3(seasonId);
    }

    /* leaderboard for all seasons */

    @GetMapping("/all")
    public Map<UUID, Set<ZSetOperations.TypedTuple<String>>> getAllLeaderboards() {

        return leaderboardService.getAllLeaderboards();
    }
}