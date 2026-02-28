package com.example.glitchfame.Leadboard;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import com.example.glitchfame.Leadboard.DTO.LeaderboardProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final LeadboardRepository participationRepository;
    private final ExtractJwtData extractJwtData;

     //Get leaderboard of all seasons
    public List<LeaderboardProjection> getLeadersOfAllSeasons() {
    Long userId = extractJwtData.getUserId();
    return participationRepository.findLeadersOfAllSeasons(userId);
}



    //get leadboard of one season
    public List<LeaderboardProjection> getLeadersBySeason(Long seasonId) {
    Long userId = extractJwtData.getUserId();
     return participationRepository.findLeadersBySeason(seasonId, userId);
    }
}