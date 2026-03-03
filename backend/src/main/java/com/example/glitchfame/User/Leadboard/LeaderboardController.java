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

   

    //lead board of all the seasons
    @GetMapping
    public List<LeaderboardProjection> getAllSeasonsLeaderboard() {
        return leaderboardService.getLeadersOfAllSeasons();
    }

   
    
    //lead board of a season
    @GetMapping("/{seasonId}")
    public List<LeaderboardProjection> getSeasonLeaderboard(
            @PathVariable Long seasonId
    ) {
        return leaderboardService.getLeadersBySeason(seasonId);
    }
}