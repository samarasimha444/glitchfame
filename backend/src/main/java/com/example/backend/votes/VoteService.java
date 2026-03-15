package com.example.backend.votes;

import com.example.backend.votes.dto.VoteUpdateDTO;
import com.example.backend.leaderboard.LeaderboardService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Arrays;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final StringRedisTemplate redis;
    private final SimpMessagingTemplate messagingTemplate;
    private final LeaderboardService leaderboardService;

    /* ---------- LUA SCRIPT ---------- */

    private static final DefaultRedisScript<String> SCRIPT;

    static {

        SCRIPT = new DefaultRedisScript<>();

        SCRIPT.setScriptText("""
            local participationKey = KEYS[1]
            local userVoteSet = KEYS[2]
            local userVoteCountKey = KEYS[3]
            local lockKey = KEYS[4]

            local participationId = ARGV[1]

            if redis.call('EXISTS', lockKey) == 1 then
                return "LOCKED"
            end

            -- check if already voted
            local voted = redis.call('SISMEMBER', userVoteSet, participationId)

            if voted == 1 then

                redis.call('SREM', userVoteSet, participationId)

                local used = tonumber(redis.call('GET', userVoteCountKey) or "0")
                if used > 0 then
                    redis.call('DECR', userVoteCountKey)
                end

                local votes = redis.call('DECR', participationKey)

                return "UNVOTE:" .. votes
            end

            -- check vote limit
            local used = tonumber(redis.call('GET', userVoteCountKey) or "0")

            if used >= 5 then
                return "LIMIT"
            end

            redis.call('INCR', userVoteCountKey)
            redis.call('SADD', userVoteSet, participationId)

            local votes = redis.call('INCR', participationKey)

            return "VOTE:" .. votes
        """);

        SCRIPT.setResultType(String.class);
    }

    /* ---------- TOGGLE VOTE ---------- */

    public boolean toggleVote(UUID participationId, UUID seasonId, UUID authId) {

        String participationKey = "votes:participation:" + participationId;
        String userVoteSet = "votes:user:" + seasonId + ":" + authId;
        String userVoteCountKey = "votes:season:usercount:" + seasonId + ":" + authId;
        String lockKey = "season:locked:" + seasonId;

        String result = redis.execute(
                SCRIPT,
                Arrays.asList(
                        participationKey,
                        userVoteSet,
                        userVoteCountKey,
                        lockKey
                ),
                participationId.toString()
        );

        if (result == null) {
            throw new IllegalStateException("Redis returned null");
        }

        if (result.equals("LOCKED")) {
            throw new IllegalStateException("Season locked");
        }

        if (result.equals("LIMIT")) {
            throw new IllegalStateException("Maximum 5 votes allowed per season");
        }

        String[] parts = result.split(":");

        String action = parts[0];
        long votes = Long.parseLong(parts[1]);

        if (action.equals("UNVOTE")) {

            leaderboardService.updateLeaderboard(
                    seasonId,
                    participationId,
                    -1
            );

            broadcastVote(participationId, votes);

            return false;
        }

        if (action.equals("VOTE")) {

            leaderboardService.updateLeaderboard(
                    seasonId,
                    participationId,
                    1
            );

            broadcastVote(participationId, votes);

            return true;
        }

        throw new IllegalStateException("Unknown vote result");
    }

    /* ---------- WEBSOCKET BROADCAST ---------- */

    private void broadcastVote(UUID participationId, long votes) {

        VoteUpdateDTO payload = new VoteUpdateDTO(participationId, votes);

        messagingTemplate.convertAndSend("/topic/votes", payload);
    }
}