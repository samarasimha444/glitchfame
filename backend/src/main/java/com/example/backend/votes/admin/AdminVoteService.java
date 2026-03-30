package com.example.backend.votes.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.UUID;
import com.example.backend.votes.async.dto.Broadcast;

@Service
@RequiredArgsConstructor
public class AdminVoteService {

    private final StringRedisTemplate redis;
    private final SimpMessagingTemplate messagingTemplate;

    public long adjustScore(UUID seasonId, UUID participationId, long scoreDelta) {

        String leaderboardKey = "l:" + seasonId;

        // update score
        Double updated = redis.opsForZSet().incrementScore(
                leaderboardKey,
                participationId.toString(),
                scoreDelta
        );

        long newScore = updated == null ? 0 : updated.longValue();

        // get rank
        Long rankObj = redis.opsForZSet()
                .reverseRank(leaderboardKey, participationId.toString());

        long rank = (rankObj == null) ? 0 : rankObj + 1;

        // broadcast
        messagingTemplate.convertAndSend(
                "/topic/votes/" + seasonId,
                new Broadcast(participationId, newScore)
        );

        return newScore;
    }
}