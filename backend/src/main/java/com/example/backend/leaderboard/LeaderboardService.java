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
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final StringRedisTemplate redis;
    private final SimpMessagingTemplate messagingTemplate;

    private final ParticipationRepo participationRepo;
    private final SeasonRepo seasonRepo;

    private static final String SEASONS_KEY = "leaderboard:seasons";

    /* update leaderboard when vote changes */

    public void updateLeaderboard(UUID seasonId, UUID participationId, int delta) {

        String leaderboardKey = "leaderboard:season:" + seasonId;

        /* register season */
        redis.opsForSet().add(SEASONS_KEY, seasonId.toString());

        /* update score in redis */
        redis.opsForZSet().incrementScore(
                leaderboardKey,
                participationId.toString(),
                delta
        );

        /* fetch updated top 3 */
        Set<ZSetOperations.TypedTuple<String>> newTop3 = getTop3Raw(seasonId);

        /* convert to DTO */
        List<LeaderboardDTO> leaderboard = buildLeaderboardDTO(seasonId, newTop3);

        /* broadcast every vote */
        messagingTemplate.convertAndSend(
                "/topic/leaderboard/" + seasonId,
                leaderboard
        );
    }

    /* get leaderboard for one season */

    public List<LeaderboardDTO> getTop3(UUID seasonId) {

        Set<ZSetOperations.TypedTuple<String>> redisData = getTop3Raw(seasonId);

        return buildLeaderboardDTO(seasonId, redisData);
    }

    /* get leaders for all LIVE seasons */

    public Map<UUID, List<LeaderboardDTO>> getLiveSeasonLeaderboards() {

        Instant now = Instant.now();

        List<Season> liveSeasons =
                seasonRepo.findByVotingStartDateBeforeAndVotingEndDateAfter(now, now);

        Map<UUID, List<LeaderboardDTO>> result = new HashMap<>();

        for (Season season : liveSeasons) {

            UUID seasonId = season.getSeasonId();

            result.put(
                    seasonId,
                    getTop3(seasonId)
            );
        }

        return result;
    }

    /* redis query */

    private Set<ZSetOperations.TypedTuple<String>> getTop3Raw(UUID seasonId) {

        String leaderboardKey = "leaderboard:season:" + seasonId;

        return redis.opsForZSet()
                .reverseRangeWithScores(leaderboardKey, 0, 2);
    }

    /* convert redis result to DTO */

    private List<LeaderboardDTO> buildLeaderboardDTO(
            UUID seasonId,
            Set<ZSetOperations.TypedTuple<String>> redisData
    ) {

        if (redisData == null || redisData.isEmpty()) {
            return Collections.emptyList();
        }

        Season season = seasonRepo.findById(seasonId)
                .orElseThrow();

        List<UUID> participationIds = redisData.stream()
                .map(x -> UUID.fromString(x.getValue()))
                .toList();

        List<Participation> participants =
                participationRepo.findAllById(participationIds);

        Map<UUID, Participation> participationMap =
                participants.stream()
                        .collect(Collectors.toMap(
                                Participation::getParticipationId,
                                p -> p
                        ));

        List<LeaderboardDTO> result = new ArrayList<>();

        for (ZSetOperations.TypedTuple<String> tuple : redisData) {

            UUID pid = UUID.fromString(tuple.getValue());

            Participation p = participationMap.get(pid);

            if (p == null) continue;

            result.add(
                    new LeaderboardDTO(
                            season.getSeasonId(),
                            season.getName(),
                            p.getParticipationId(),
                            p.getName(),
                            p.getPhotoUrl(),
                            tuple.getScore().intValue()
                    )
            );
        }

        return result;
    }

}