package com.example.backend.leaderboard;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.*;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final StringRedisTemplate redis;
    private final SimpMessagingTemplate messagingTemplate;

    private static final String SEASONS_KEY = "leaderboard:seasons";

    /* update leaderboard when vote changes */

    public void updateLeaderboard(UUID seasonId, UUID participationId, int delta) {

        String leaderboardKey = "leaderboard:season:" + seasonId;

        /* register season for global leaderboard lookup */
        redis.opsForSet().add(SEASONS_KEY, seasonId.toString());

        Set<ZSetOperations.TypedTuple<String>> oldTop3 = getTop3(seasonId);

        redis.opsForZSet().incrementScore(
                leaderboardKey,
                participationId.toString(),
                delta
        );

        Set<ZSetOperations.TypedTuple<String>> newTop3 = getTop3(seasonId);

        if (!extractIds(oldTop3).equals(extractIds(newTop3))) {
            broadcastLeaderboard(seasonId, newTop3);
        }
    }

    /* get leaderboard for a season */

    public Set<ZSetOperations.TypedTuple<String>> getTop3(UUID seasonId) {

        String leaderboardKey = "leaderboard:season:" + seasonId;

        return redis.opsForZSet()
                .reverseRangeWithScores(
                        leaderboardKey,
                        0,
                        2
                );
    }

    /* get full leaderboard (optional if needed later) */

    public Set<ZSetOperations.TypedTuple<String>> getFullLeaderboard(UUID seasonId) {

        String leaderboardKey = "leaderboard:season:" + seasonId;

        return redis.opsForZSet()
                .reverseRangeWithScores(
                        leaderboardKey,
                        0,
                        -1
                );
    }

    /* get all season leaderboards */

    public Map<UUID, Set<ZSetOperations.TypedTuple<String>>> getAllLeaderboards() {

        Set<String> seasons = redis.opsForSet().members(SEASONS_KEY);

        Map<UUID, Set<ZSetOperations.TypedTuple<String>>> result = new HashMap<>();

        if (seasons == null) {
            return result;
        }

        for (String season : seasons) {

            UUID seasonId = UUID.fromString(season);

            result.put(
                    seasonId,
                    getTop3(seasonId)
            );
        }

        return result;
    }

    /* websocket broadcast */

    private void broadcastLeaderboard(UUID seasonId,
                                      Set<ZSetOperations.TypedTuple<String>> top3) {

        messagingTemplate.convertAndSend(
                "/topic/leaderboard/" + seasonId,
                top3
        );
    }

  
  
    private List<String> extractIds(Set<ZSetOperations.TypedTuple<String>> set) {

        if (set == null) {
            return Collections.emptyList();
        }

        return set.stream()
                .map(ZSetOperations.TypedTuple::getValue)
                .collect(Collectors.toList());
    }
}