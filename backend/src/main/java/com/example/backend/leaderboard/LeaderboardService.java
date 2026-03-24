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

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

        private final StringRedisTemplate redis;
        private final ParticipationRepo participationRepo;
        private final SeasonRepo seasonRepo;

    public List<LeaderboardDTO> getTop3(UUID seasonId) {
         String leaderboardKey = "leaderboard:season:" + seasonId;
        Set<ZSetOperations.TypedTuple<String>> redisData =
                redis.opsForZSet().reverseRangeWithScores(leaderboardKey, 0, 2);
        return buildLeaderboardDTO(seasonId, redisData);
    }




    public Map<UUID, List<LeaderboardDTO>> getLiveSeasonLeaderboards() {
        Instant now = Instant.now();
        List<Season> liveSeasons =
                seasonRepo.findByVotingStartDateBeforeAndVotingEndDateAfter(now, now);
        Map<UUID, List<LeaderboardDTO>> result = new HashMap<>();

        for (Season season : liveSeasons) {
            UUID seasonId = season.getSeasonId();
            result.put(seasonId, getTop3(seasonId));
        }

        return result;
    }






    private List<LeaderboardDTO> buildLeaderboardDTO(
            UUID seasonId,
            Set<ZSetOperations.TypedTuple<String>> redisData
    ) {

        if (redisData == null || redisData.isEmpty()) {
            return Collections.emptyList();
        }

        Season season = seasonRepo.findById(seasonId).orElseThrow();
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