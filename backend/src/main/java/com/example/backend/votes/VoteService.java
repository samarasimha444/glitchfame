package com.example.backend.votes;
import com.example.backend.votes.dto.VoteUpdateDTO;
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
    private final VoteAsyncService voteAsyncService;

    /* ---------- LUA SCRIPT ---------- */

    private static final DefaultRedisScript<String> SCRIPT;

    static {

        SCRIPT = new DefaultRedisScript<>();

        SCRIPT.setScriptText("""
            local userVoteSet = KEYS[1]
            local leaderboardKey = KEYS[2]
            local lockKey = KEYS[3]

            local participationId = ARGV[1]

            if redis.call('EXISTS', lockKey) == 1 then
                return "LOCKED"
            end

            local voted = redis.call('SISMEMBER', userVoteSet, participationId)

            if voted == 1 then

                redis.call('SREM', userVoteSet, participationId)
                redis.call('ZINCRBY', leaderboardKey, -1, participationId)

                local votes = redis.call('ZSCORE', leaderboardKey, participationId)

                return "UNVOTE:" .. votes
            end

            local used = redis.call('SCARD', userVoteSet)

            if used >= 5 then
                return "LIMIT"
            end

            redis.call('SADD', userVoteSet, participationId)
            redis.call('ZINCRBY', leaderboardKey, 1, participationId)

            local votes = redis.call('ZSCORE', leaderboardKey, participationId)

            return "VOTE:" .. votes
        """);

        SCRIPT.setResultType(String.class);
    }

    /* ---------- TOGGLE VOTE ---------- */

    public boolean toggleVote(UUID participationId, UUID seasonId, UUID authId) {

        String userVoteSet = "votes:user:" + seasonId + ":" + authId;
        String leaderboardKey = "leaderboard:season:" + seasonId;
        String lockKey = "season:locked:" + seasonId;

        String result = redis.execute(
                SCRIPT,
                Arrays.asList(
                        userVoteSet,
                        leaderboardKey,
                        lockKey
                ),
                participationId.toString()
        );

        if (result == null) {
            throw new IllegalStateException("Redis returned null");
        }
    if (result.equals("LIMIT")) {
            throw new IllegalStateException("Maximum 5 votes allowed per season");
        }

        String[] parts = result.split(":");

        String action = parts[0];
        long votes = Long.parseLong(parts[1]);

        boolean voted = action.equals("VOTE");
        broadcastVote(seasonId, participationId, votes);

        // async DB persistence
        voteAsyncService.persistVote(voted, participationId, authId);
    return voted;
    }

    /* ---------- WEBSOCKET BROADCAST ---------- */

    private void broadcastVote(UUID seasonId, UUID participationId, long votes) {
    VoteUpdateDTO payload = new VoteUpdateDTO(
                participationId,
                votes);
                messagingTemplate.convertAndSend(
                "/topic/votes/" + seasonId,
                payload);
    }
}