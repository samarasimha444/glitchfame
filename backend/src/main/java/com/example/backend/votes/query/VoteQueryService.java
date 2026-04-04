package com.example.backend.votes.query;

import com.example.backend.votes.query.dto.VoteQuery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
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

        try {
            return internalGetMetaBatch(ids, seasonId, authId);
        } catch (Exception e) {
            log.error("🔥 Redis failure in getMetaBatch", e);

            // ✅ fallback (never break API)
            return ids.stream().collect(Collectors.toMap(
                    id -> id,
                    id -> new VoteQuery(0L, 0L, 0, 0, false, false)
            ));
        }
    }

    private Map<UUID, VoteQuery> internalGetMetaBatch(
            List<UUID> ids,
            UUID seasonId,
            UUID authId
    ) {

        String leaderboard = "l:" + seasonId;
        String voteCountKey = "vc:" + seasonId;
        String killCountKey = "kc:" + seasonId;

        // ================= USER STATE =================
        Set<String> userVotes = Collections.emptySet();
        Set<String> userKills = Collections.emptySet();

        if (authId != null) {

            String voteKey = "v:" + seasonId + ":" + authId;
            String killKey = "k:" + seasonId + ":" + authId;

            try {
                userVotes = Optional.ofNullable(redis.opsForSet().members(voteKey))
                        .orElse(Collections.emptySet());
            } catch (Exception e) {
                log.warn("Vote set fetch failed", e);
            }

            try {
                userKills = Optional.ofNullable(redis.opsForSet().members(killKey))
                        .orElse(Collections.emptySet());
            } catch (Exception e) {
                log.warn("Kill set fetch failed", e);
            }
        }

        // ================= COUNTS =================
        Map<Object, Object> voteCounts = Collections.emptyMap();
        Map<Object, Object> killCounts = Collections.emptyMap();

        try {
            voteCounts = redis.opsForHash().entries(voteCountKey);
            killCounts = redis.opsForHash().entries(killCountKey);
        } catch (Exception e) {
            log.warn("Count fetch failed", e);
        }

        // ================= PIPELINE =================
        List<Object> redisData = Collections.emptyList();

        try {
            redisData = redis.executePipelined((RedisCallback<Object>) conn -> {

                byte[] key = leaderboard.getBytes(StandardCharsets.UTF_8);

                for (UUID id : ids) {
                    byte[] member = id.toString().getBytes(StandardCharsets.UTF_8);

                    conn.zSetCommands().zScore(key, member);
                    conn.zSetCommands().zRevRank(key, member);
                }

                return null;
            });
        } catch (Exception e) {
            log.error("Pipeline failed", e);
        }

        // ================= BUILD RESULT =================
        Map<UUID, VoteQuery> result = new HashMap<>();

        for (int i = 0; i < ids.size(); i++) {

            UUID id = ids.get(i);

            Object scoreObj = (redisData.size() > i * 2) ? redisData.get(i * 2) : null;
            Object rankObj = (redisData.size() > i * 2 + 1) ? redisData.get(i * 2 + 1) : null;

            double scoreVal = 0;
            long rankVal = 0;

            // ✅ SAFE SCORE PARSE
            if (scoreObj instanceof Double d) {
                scoreVal = d;
            } else if (scoreObj instanceof String s) {
                scoreVal = Double.parseDouble(s);
            }

            // ✅ SAFE RANK PARSE
            if (rankObj instanceof Long l) {
                rankVal = l;
            } else if (rankObj instanceof Integer iVal) {
                rankVal = iVal.longValue();
            }

            long score = (long) scoreVal;
            long rank = (rankVal == 0) ? 0 : rankVal + 1;

            int votes = Integer.parseInt(
                    voteCounts.getOrDefault(id.toString(), "0").toString()
            );

            int kills = Integer.parseInt(
                    killCounts.getOrDefault(id.toString(), "0").toString()
            );

            boolean hasVoted = authId != null && userVotes.contains(id.toString());
            boolean hasKilled = authId != null && userKills.contains(id.toString());

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