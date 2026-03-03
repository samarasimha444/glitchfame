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

    // ============================================================
    // 🔥 REST: TOP 3 OF ALL SEASONS
    // ============================================================

    @Transactional(readOnly = true)
    public List<LeaderboardProjection> getTop3OfAllSeasons() {

        Long userId = extractJwtData.getUserId();

        return leaderboardRepository.findTop3OfAllSeasons(userId);
    }

    // ============================================================
    // 🔥 REST: TOP 3 OF ONE SEASON
    // ============================================================

    @Transactional(readOnly = true)
    public List<LeaderboardProjection> getTop3BySeason(Long seasonId) {

        Long userId = extractJwtData.getUserId();

        return leaderboardRepository.findTop3BySeason(seasonId, userId);
    }

    // ============================================================
    // 🔥 WEBSOCKET: BROADCAST TOP 3 (NO USER CONTEXT)
    // ============================================================

    @Transactional(readOnly = true)
    public void broadcastTop3Leaderboard(Long seasonId) {

        List<LeaderboardProjection> leaderboard =
                leaderboardRepository.findTop3BySeasonForBroadcast(seasonId);

        messagingTemplate.convertAndSend(
                "/topic/leaderboard/" + seasonId,
                leaderboard
        );

        System.out.println("Broadcasting TOP 3 leaderboard for season: " + seasonId);
        System.out.println("Top 3 size: " + leaderboard.size());
    }
}