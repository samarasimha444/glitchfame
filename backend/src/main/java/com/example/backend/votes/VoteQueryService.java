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

        // 🔥 guard clause
        if (participationIds == null || participationIds.isEmpty()) {
            return Collections.emptyMap();
        }

        String leaderboardKey = "leaderboard:season:" + seasonId;

        /* ---------- 1. Fetch user votes (ONLY if authId exists) ---------- */

        Set<String> userVotes = Collections.emptySet();

        if (authId != null) {
            String userVoteKey = "votes:user:" + seasonId + ":" + authId;

            Set<String> userVotesRaw = redis.opsForSet().members(userVoteKey);

            userVotes = userVotesRaw != null
                    ? userVotesRaw
                    : Collections.emptySet();
        }

        /* ---------- 2. Fetch vote counts from Redis (ALWAYS) ---------- */

        List<Object> scores = redis.executePipelined(
                (RedisCallback<Object>) connection -> {

                    byte[] keyBytes = leaderboardKey.getBytes();

                    for (UUID id : participationIds) {
                        connection.zSetCommands().zScore(
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

            boolean hasVoted = authId != null && userVotes.contains(id.toString());

            result.put(id, new VoteMeta(votes, hasVoted));
        }

        return result;
    }
}