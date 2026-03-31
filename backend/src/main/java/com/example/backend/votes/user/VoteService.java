package com.example.backend.votes.user;

import com.example.backend.config.redis.RedisService;
import com.example.backend.votes.async.VoteAsyncService;
import com.example.backend.votes.user.dto.VoteResponseDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final StringRedisTemplate redis;
    private final RedisService redisService;
    private final VoteAsyncService voteAsyncService;

    private static final DefaultRedisScript<List> SCRIPT;

    static {
        SCRIPT = new DefaultRedisScript<>();

        SCRIPT.setScriptText("""
            local voteSet = KEYS[1]
            local killKey = KEYS[2]
            local leaderboard = KEYS[3]
            local lockKey = KEYS[4]
            local voteCount = KEYS[5]
            local killCount = KEYS[6]

            local pid = ARGV[1]
            local action = ARGV[2]

            if redis.call('EXISTS', lockKey) == 1 then
                return {"LOCKED","0"}
            end

            local score = 0
            local result = ""

            if action == "VOTE" then
                local voted = redis.call('SISMEMBER', voteSet, pid)
                local killed = redis.call('GET', killKey)

                if voted == 1 then
                    redis.call('SREM', voteSet, pid)
                    redis.call('HINCRBY', voteCount, pid, -1)
                    score = redis.call('ZINCRBY', leaderboard, -100, pid)
                    result = "UNVOTE"
                else
                    if redis.call('SCARD', voteSet) >= 3 then
                        return {"LIMIT","0"}
                    end

                    if killed == pid then
                        redis.call('DEL', killKey)
                        redis.call('HINCRBY', killCount, pid, -1)
                        redis.call('ZINCRBY', leaderboard, 200, pid)
                    end

                    redis.call('SADD', voteSet, pid)
                    redis.call('HINCRBY', voteCount, pid, 1)
                    score = redis.call('ZINCRBY', leaderboard, 100, pid)
                    result = "VOTE"
                end
            end

            if action == "KILL" then
                local currentKill = redis.call('GET', killKey)
                local voted = redis.call('SISMEMBER', voteSet, pid)

                if currentKill == pid then
                    redis.call('DEL', killKey)
                    redis.call('HINCRBY', killCount, pid, -1)
                    score = redis.call('ZINCRBY', leaderboard, 200, pid)
                    result = "UNKILL"
                else
                    if voted == 1 then
                        redis.call('SREM', voteSet, pid)
                        redis.call('HINCRBY', voteCount, pid, -1)
                        redis.call('ZINCRBY', leaderboard, -100, pid)
                    end

                    if currentKill then
                        redis.call('HINCRBY', killCount, currentKill, -1)
                        redis.call('ZINCRBY', leaderboard, 200, currentKill)
                    end

                    redis.call('SET', killKey, pid)
                    redis.call('HINCRBY', killCount, pid, 1)
                    score = redis.call('ZINCRBY', leaderboard, -200, pid)
                    result = "KILL"
                end
            end

            return {result, tostring(score)}
        """);

        SCRIPT.setResultType(List.class);
    }

    public VoteResponseDTO performAction(UUID participationId,
                                         UUID seasonId,
                                         UUID authId,
                                         String action) {

        if (authId == null) {
            throw new IllegalArgumentException("Unauthorized");
        }

        if (participationId == null || seasonId == null || action == null) {
            throw new IllegalArgumentException("Invalid request");
        }

        if (!action.equals("VOTE") && !action.equals("KILL")) {
            throw new IllegalArgumentException("Invalid action");
        }

        String voteSet = "v:" + seasonId + ":" + authId;
        String killKey = "k:" + seasonId + ":" + authId;
        String leaderboard = "l:" + seasonId;
        String lockKey = "lock:" + seasonId;
        String voteCount = "vc:" + seasonId;
        String killCount = "kc:" + seasonId;

        List<Object> raw = (List<Object>) redis.execute(
                SCRIPT,
                List.of(voteSet, killKey, leaderboard, lockKey, voteCount, killCount),
                participationId.toString(),
                action
        );

        if (raw == null || raw.size() < 2) {
            throw new IllegalStateException("Invalid Redis response");
        }

        String type = raw.get(0).toString();

        if ("LOCKED".equals(type)) {
            throw new IllegalStateException("Season locked");
        }

        if ("LIMIT".equals(type)) {
            throw new IllegalStateException("Max 3 votes allowed");
        }

        long score = Long.parseLong(raw.get(1).toString());

        voteAsyncService.process(
                seasonId,
                participationId,
                authId,
                action,
                type,
                score
        );

        return new VoteResponseDTO(type, score);
    }
}