package com.example.backend.votes.admin;

import com.example.backend.leaderboard.LeaderboardService;
import com.example.backend.participation.Participation;
import com.example.backend.participation.ParticipationRepo;
import com.example.backend.votes.dto.VoteUpdateDTO;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminVoteService {

    private final StringRedisTemplate redis;
    private final LeaderboardService leaderboardService;
    private final ParticipationRepo participationRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public long adjustVotes(UUID participationId, long voteDelta) {

        Participation participation = participationRepo.findById(participationId)
                .orElseThrow(() -> new IllegalStateException("Participation not found"));

        UUID seasonId = participation.getSeasonId();

        String participationKey = "votes:participation:" + participationId;

        /* if removing votes check that result is not negative */
        if (voteDelta < 0) {

            String current = redis.opsForValue().get(participationKey);
            long currentVotes = current == null ? 0 : Long.parseLong(current);

            if (currentVotes + voteDelta < 0) {
                throw new IllegalStateException("Votes cannot become negative");
            }
        }

        Long newVotes = redis.opsForValue().increment(participationKey, voteDelta);

        leaderboardService.updateLeaderboard(
                seasonId,
                participationId,
                (int) voteDelta
        );

        broadcastVote(participationId, newVotes);

        return newVotes;
    }

    private void broadcastVote(UUID participationId, long votes) {

        VoteUpdateDTO payload = new VoteUpdateDTO(participationId, votes);

        messagingTemplate.convertAndSend("/topic/votes", payload);
    }
}