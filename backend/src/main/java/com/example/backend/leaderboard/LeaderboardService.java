package com.example.backend.leaderboard;

import com.example.backend.leaderboard.dto.LeaderboardDTO;
import com.example.backend.participation.Participation;
import com.example.backend.participation.ParticipationRepo;
import com.example.backend.seasons.SeasonRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.data.domain.PageRequest;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaderboardService {

    private final StringRedisTemplate redis;
    private final ParticipationRepo participationRepo;
    private final SeasonRepo seasonRepo;

    // ================= TOP 3 =================
    public List<LeaderboardDTO> getTop3(UUID seasonId) {

        String leaderboardKey = "l:" + seasonId;

        Set<ZSetOperations.TypedTuple<String>> redisData =
                redis.opsForZSet().reverseRangeWithScores(leaderboardKey, 0, 2);

        if (redisData == null || redisData.isEmpty()) {
            return Collections.emptyList();
        }

        List<UUID> ids = redisData.stream()
                .map(t -> UUID.fromString(t.getValue()))
                .toList();

        Map<UUID, Participation> participantMap =
                participationRepo.findAllById(ids)
                        .stream()
                        .collect(Collectors.toMap(
                                Participation::getParticipationId,
                                p -> p
                        ));

        List<LeaderboardDTO> result = new ArrayList<>(3);

        // 🔥 tie-safe ranking
        int rank = 0;
        int position = 0;
        int prevScore = Integer.MIN_VALUE;

        for (ZSetOperations.TypedTuple<String> tuple : redisData) {

            position++;

            UUID pid = UUID.fromString(tuple.getValue());
            Participation p = participantMap.get(pid);

            if (p == null) {
                log.warn("Missing participant {}", pid);
                continue;
            }

            int score = tuple.getScore() == null
                    ? 0
                    : tuple.getScore().intValue();

            if (score != prevScore) {
                rank = position;
                prevScore = score;
            }

            result.add(
                    new LeaderboardDTO(
                            seasonId,                 // ✅ no DB call
                            null,                     // ⚠️ remove seasonName OR fill from cache
                            p.getParticipationId(),
                            p.getName(),
                            p.getPhotoUrl(),
                            score,
                            rank
                    )
            );
        }

        return result;
    }

    // ================= LIVE SEASONS =================
public Map<UUID, List<LeaderboardDTO>> getLiveSeasonLeaderboards(int limit) {

    Instant now = Instant.now(); // ✅ required

    List<UUID> seasonIds =
            seasonRepo.findLiveSeasonIds(now, PageRequest.of(0, limit));

    Map<UUID, List<LeaderboardDTO>> result = new HashMap<>();

    for (UUID seasonId : seasonIds) {
        result.put(seasonId, getTop3(seasonId));
    }

    return result;
}
}