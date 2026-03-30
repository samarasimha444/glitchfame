package com.example.backend.votes.query;
import com.example.backend.votes.query.dto.VoteQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VoteQueryService {

    private final StringRedisTemplate redis;

    public Map<UUID, VoteQuery> getMetaBatch(
            List<UUID> ids,
            UUID seasonId,
            UUID authId
    ) {

        if (ids == null || ids.isEmpty()) return Collections.emptyMap();

        String leaderboard = "l:" + seasonId;
        String voteCountKey = "vc:" + seasonId;
        String killCountKey = "kc:" + seasonId;

        // ================= USER STATE =================
        Set<String> userVotes = Collections.emptySet();
        String killed = null;

        if (authId != null) {
            String voteKey = "v:" + seasonId + ":" + authId;
            userVotes = Optional.ofNullable(redis.opsForSet().members(voteKey))
                    .orElse(Collections.emptySet());

            String killKey = "k:" + seasonId + ":" + authId;
            killed = redis.opsForValue().get(killKey);
        }

        // ================= COUNTS =================
        Map<Object, Object> voteCounts =
                redis.opsForHash().entries("vc:" + seasonId);

        Map<Object, Object> killCounts =
                redis.opsForHash().entries("kc:" + seasonId);

        // ================= PIPELINE =================
        List<Object> redisData = redis.executePipelined((RedisCallback<Object>) conn -> {

            byte[] key = leaderboard.getBytes(StandardCharsets.UTF_8);

            for (UUID id : ids) {
                byte[] member = id.toString().getBytes(StandardCharsets.UTF_8);

                conn.zSetCommands().zScore(key, member);
                conn.zSetCommands().zRevRank(key, member);
            }

            return null;
        });

        // ================= BUILD RESULT =================
        Map<UUID, VoteQuery> result = new HashMap<>();

        for (int i = 0; i < ids.size(); i++) {

            UUID id = ids.get(i);

            Double s = (Double) redisData.get(i * 2);
            Long r = (Long) redisData.get(i * 2 + 1);

            long score = (s == null) ? 0 : s.longValue();
            long rank = (r == null) ? 0 : r + 1;

            int votes = Integer.parseInt(
                    voteCounts.getOrDefault(id.toString(), "0").toString()
            );

            int kills = Integer.parseInt(
                    killCounts.getOrDefault(id.toString(), "0").toString()
            );

            boolean hasVoted = authId != null && userVotes.contains(id.toString());
            boolean hasKilled = authId != null && id.toString().equals(killed);

            result.put(id, new VoteQuery(
                    score,
                    rank,
                    votes,
                    kills,
                    hasVoted,
                    hasKilled
            ));
        }

        return result;
    }
}