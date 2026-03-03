package com.example.glitchfame.User.Leadboard;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import com.example.glitchfame.User.Leadboard.DTO.LeaderboardProjection;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final LeadboardRepository leaderboardRepository;
    private final ExtractJwtData extractJwtData;
    private final SimpMessagingTemplate messagingTemplate;

    // =========================
    // REST: All seasons
    // =========================
    @Transactional(readOnly = true)
    public List<LeaderboardProjection> getLeadersOfAllSeasons() {

        Long userId = extractJwtData.getUserId();

        return leaderboardRepository.findLeadersOfAllSeasons(userId);
    }

    // =========================
    // REST: Single season (with user context)
    // =========================
    @Transactional(readOnly = true)
    public List<LeaderboardProjection> getLeadersBySeason(Long seasonId) {

        Long userId = extractJwtData.getUserId();

        return leaderboardRepository.findLeadersBySeason(seasonId, userId);
    }

    // =========================
    // WEBSOCKET: Broadcast (NO JWT)
    // =========================
    @Transactional(readOnly = true)
    public void broadcastLeaderboard(Long seasonId) {

        // IMPORTANT: separate method without userId
        List<LeaderboardProjection> leaderboard =
                leaderboardRepository.findLeadersBySeasonForBroadcast(seasonId);

        messagingTemplate.convertAndSend(
                "/topic/leaderboard/" + seasonId,
                leaderboard
        );
        System.out.println("Broadcasting leaderboard for season: " + seasonId);
System.out.println("Leaderboard size: " + leaderboard.size());
    }
}