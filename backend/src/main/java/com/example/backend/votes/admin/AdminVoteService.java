package com.example.backend.votes.admin;

import com.example.backend.participation.Participation;
import com.example.backend.participation.ParticipationRepo;
import com.example.backend.votes.dto.VoteUpdateDTO;
import com.example.backend.config.redis.RedisService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminVoteService {

    private final StringRedisTemplate redis;
    private final ParticipationRepo participationRepo;
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisService redisService; // ✅ centralized registry

    public long adjustVotes(UUID participationId, long voteDelta) {

        Participation participation = participationRepo.findById(participationId)
                .orElseThrow(() -> new IllegalStateException("Participation not found"));

        UUID seasonId = participation.getSeasonId();

        String leaderboardKey = "leaderboard:season:" + seasonId;

        // ✅ register via helper (fixed)
        redisService.registerSeasonKey(seasonId, leaderboardKey);

        // get current votes
        Double currentScore = redis.opsForZSet()
                .score(leaderboardKey, participationId.toString());

        long currentVotes = currentScore == null ? 0 : currentScore.longValue();

        // prevent negative
        if (voteDelta < 0 && currentVotes + voteDelta < 0) {
            throw new IllegalStateException("Votes cannot become negative");
        }

        Double updated = redis.opsForZSet().incrementScore(
                leaderboardKey,
                participationId.toString(),
                voteDelta
        );

        long newVotes = updated == null ? 0 : updated.longValue();

        broadcastVote(seasonId, participationId, newVotes);

        return newVotes;
    }

    private void broadcastVote(UUID seasonId, UUID participationId, long votes) {

        VoteUpdateDTO payload = new VoteUpdateDTO(participationId, votes);

        messagingTemplate.convertAndSend(
                "/topic/votes/" + seasonId,
                payload
        );
    }
}