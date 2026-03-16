package com.example.backend.winner;

import com.example.backend.participation.Participation;
import com.example.backend.participation.ParticipationRepo;
import com.example.backend.seasons.Season;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WinnerService {

    private final StringRedisTemplate redis;
    private final ParticipationRepo participationRepo;
    private final WinnerRepo winnerRepo;

    public Winner calculateWinner(UUID seasonId, Season season) {

        String leaderboardKey = "leaderboard:season:" + seasonId;

        Set<ZSetOperations.TypedTuple<String>> top =
                redis.opsForZSet()
                        .reverseRangeWithScores(leaderboardKey, 0, 0); // get top 1

        if (top == null || top.isEmpty()) {
            return null; // no participants
        }

        ZSetOperations.TypedTuple<String> tuple = top.iterator().next();

        UUID participationId = UUID.fromString(tuple.getValue());
        long votes = tuple.getScore().longValue();

        Participation p = participationRepo.findById(participationId)
                .orElseThrow();

        Winner winner = new Winner();

        winner.setParticipantName(p.getName());
        winner.setDob(p.getDateOfBirth());
        winner.setLocation(p.getLocation());
        winner.setDescription(p.getDescription());
        winner.setParticipantPhoto(p.getPhotoUrl());

        winner.setTotalVotes(votes);
        winner.setSeasonName(season.getName());
        winner.setSeasonEndingDate(season.getVotingEndDate());

        try {
            return winnerRepo.save(winner); // return saved winner
        } catch (DataIntegrityViolationException e) {
            // winner already inserted
            return winnerRepo.findBySeasonName(season.getName()).orElse(null);
        }
    }
}