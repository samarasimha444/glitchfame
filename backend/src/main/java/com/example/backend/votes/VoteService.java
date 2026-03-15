package com.example.backend.votes;

import com.example.backend.seasons.Season;
import com.example.backend.seasons.SeasonRepo;
import com.example.backend.votes.dto.VoteUpdateDTO;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepo voteRepo;
    private final StringRedisTemplate redis;
    private final SeasonRepo seasonRepo;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public boolean toggleVote(UUID participationId, UUID seasonId, UUID authId) {

        Season season = seasonRepo.findById(seasonId)
                .orElseThrow(() -> new IllegalStateException("Season not found"));

        if (season.isLocked()) {
            throw new IllegalStateException("Season locked");
        }

        String participationKey = "votes:participation:" + participationId;
        String seasonUserKey = "votes:season:user:" + seasonId + ":" + authId;

        int deleted = voteRepo.deleteByParticipationIdAndAuthId(participationId, authId);

        if (deleted > 0) {

            List<Object> results = redis.executePipelined((RedisConnection connection) -> {

                connection.stringCommands().decr(
                        participationKey.getBytes(StandardCharsets.UTF_8));

                connection.stringCommands().decr(
                        seasonUserKey.getBytes(StandardCharsets.UTF_8));

                return null;
            });

            long votes = (Long) results.get(0);

            broadcastVote(participationId, votes);

            return false;
        }

        long votesUsed = redis.opsForValue().increment(seasonUserKey);

        if (votesUsed > 5) {
            redis.opsForValue().decrement(seasonUserKey);
            throw new IllegalStateException("Maximum 5 votes allowed per season");
        }

        Vote vote = Vote.builder()
                .participationId(participationId)
                .authId(authId)
                .build();

        voteRepo.save(vote);

        List<Object> results = redis.executePipelined((RedisConnection connection) -> {

            connection.stringCommands().incr(
                    participationKey.getBytes(StandardCharsets.UTF_8));

            return null;
        });

        long votes = (Long) results.get(0);

        broadcastVote(participationId, votes);

        return true;
    }

    private void broadcastVote(UUID participationId, long votes) {

        VoteUpdateDTO payload = new VoteUpdateDTO(participationId, votes);

        messagingTemplate.convertAndSend("/topic/votes", payload);
    }
}