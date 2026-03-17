package com.example.backend.votes;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.stereotype.Service;

import com.example.backend.votes.dto.VoteMeta;

import java.util.*;

@Service
@RequiredArgsConstructor
public class VoteQueryService {

    private final StringRedisTemplate redis;

    public Map<UUID, VoteMeta> getVoteMetaBatch(
            List<UUID> participationIds,
            UUID seasonId,
            UUID authId
    ) {

        if (participationIds == null || participationIds.isEmpty()) {
            return Collections.emptyMap();
        }

        String leaderboardKey = "leaderboard:season:" + seasonId;
        String userVoteKey = "votes:user:" + seasonId + ":" + authId;

        /* ---------- 1. Fetch user votes (single call) ---------- */

        Set<String> userVotesRaw = redis.opsForSet().members(userVoteKey);
        Set<String> userVotes = userVotesRaw != null
                ? userVotesRaw
                : Collections.emptySet();

        /* ---------- 2. Pipeline ZSET score calls ---------- */

        List<Object> scores = redis.executePipelined(
                (RedisCallback<Object>) connection -> {

                    byte[] keyBytes = leaderboardKey.getBytes();

                    for (UUID id : participationIds) {
                        connection.zScore(
                                keyBytes,
                                id.toString().getBytes()
                        );
                    }

                    return null;
                }
        );

        /* ---------- 3. Build response ---------- */

        Map<UUID, VoteMeta> result = new HashMap<>();

        for (int i = 0; i < participationIds.size(); i++) {

            UUID id = participationIds.get(i);

            Double score = (Double) scores.get(i);

            long votes = score == null ? 0L : score.longValue();
            boolean hasVoted = userVotes.contains(id.toString());

            result.put(id, new VoteMeta(votes, hasVoted));
        }

        return result;
    }
}