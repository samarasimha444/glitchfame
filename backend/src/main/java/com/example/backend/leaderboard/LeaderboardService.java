package com.example.backend.leaderboard;

import com.example.backend.leaderboard.dto.LeaderboardDTO;
import com.example.backend.participation.Participation;
import com.example.backend.participation.ParticipationRepo;
import com.example.backend.seasons.Season;
import com.example.backend.seasons.SeasonRepo;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final StringRedisTemplate redis;
    private final ParticipationRepo participationRepo;
    private final SeasonRepo seasonRepo;

    // ================= TOP 3 =================
    public List<LeaderboardDTO> getTop3(UUID seasonId) {

        String leaderboardKey = "l:" + seasonId;

        // 🔥 Redis gives sorted by score DESC
        Set<ZSetOperations.TypedTuple<String>> redisData =
                redis.opsForZSet().reverseRangeWithScores(leaderboardKey, 0, 2);

        if (redisData == null || redisData.isEmpty()) {
            return Collections.emptyList();
        }

        // 🔥 Convert IDs
        List<UUID> ids = redisData.stream()
                .map(t -> UUID.fromString(t.getValue()))
                .toList();

        // 🔥 Fetch participants
        Map<UUID, Participation> participantMap =
                participationRepo.findAllById(ids)
                        .stream()
                        .collect(Collectors.toMap(
                                Participation::getParticipationId,
                                p -> p
                        ));

        Season season = seasonRepo.findById(seasonId)
                .orElseThrow(() -> new RuntimeException("Season not found"));

        List<LeaderboardDTO> result = new ArrayList<>(3);

        int rank = 1;

        // 🔥 IMPORTANT: Redis preserves sorted order
        for (ZSetOperations.TypedTuple<String> tuple : redisData) {

            UUID pid = UUID.fromString(tuple.getValue());
            Participation p = participantMap.get(pid);

            if (p == null) continue;

            int score = tuple.getScore() == null
                    ? 0
                    : tuple.getScore().intValue();

            result.add(
                    new LeaderboardDTO(
                            season.getSeasonId(),
                            season.getName(),
                            p.getParticipationId(),
                            p.getName(),
                            p.getPhotoUrl(),
                            score,
                            rank++   // rank = position
                    )
            );
        }

        return result;
    }
}