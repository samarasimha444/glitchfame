package com.example.glitchfame.User.Votes;

import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import com.example.glitchfame.User.Contestants.ContestantRepository;
import com.example.glitchfame.User.Contestants.Participation;
import com.example.glitchfame.User.Leadboard.LeaderboardService;
import com.example.glitchfame.User.Votes.DTO.VoteResponse;
import com.example.glitchfame.Auth.User;
import com.example.glitchfame.Auth.AuthRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VoteService {


private final VotesRepository votesRepository;
private final ContestantRepository contestantRepository;
private final AuthRepository userRepository;
private final ExtractJwtData extractJwtData;
private final SimpMessagingTemplate messagingTemplate;
private final LeaderboardService leaderboardService;

@Transactional
public VoteResponse toggleVote(Long participationId) {

    // Get logged in user
    Long userId = extractJwtData.getUserId();

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User does not exist"
            ));

    // Check if admin disabled voting
    if (!user.isCanVote()) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Voting access has been disabled for your account"
        );
    }

    // Fetch contestant participation
    Participation participation = contestantRepository
            .findById(participationId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Contestant not found"
            ));

    var season = participation.getSeason();

    // Season lock check
    if (season.isSeasonLock()) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "This season is closed"
        );
    }

    // Vote lock check
    if (season.isVoteLock()) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Voting for this season is currently disabled"
        );
    }
    // Voting start date check
if (LocalDateTime.now().isBefore(season.getVotingStartDate())) {
    throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "Voting has not started yet"
    );
}

// Voting end date check
    if (LocalDateTime.now().isAfter(season.getVotingEndDate())) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Voting period has ended"
        );
    }

    Long seasonId = season.getId();

    // Check if user already voted this contestant
    boolean alreadyVoted =
            votesRepository.existsByContestant_IdAndVoter_Id(
                    participationId, userId
            );

    // Enforce max 5 votes per season
    if (!alreadyVoted) {

        long votesInSeason =
                votesRepository.countVotesByUserInSeason(
                        userId, seasonId
                );

        if (votesInSeason >= 5) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Maximum vote limit (5) reached for this season"
            );
        }
    }

    // Toggle vote
    if (alreadyVoted) {

        votesRepository.deleteByContestant_IdAndVoter_Id(
                participationId, userId
        );

    } else {

        Vote vote = Vote.builder()
                .contestant(participation)
                .voter(user)
                .build();

        votesRepository.save(vote);
    }

   Long updatedCount = votesRepository.getTotalVotes(participationId);

// ensure vote count never becomes negative
if (updatedCount == null || updatedCount < 0) {
    updatedCount = 0L;
}

    // Broadcast vote update
    messagingTemplate.convertAndSend(
            "/topic/votes",
            Map.of(
                    "participationId", participationId,
                    "voteCount", updatedCount
            )
    );

    // Broadcast leaderboard update
    leaderboardService.broadcastTop3Leaderboard(seasonId);

    // Return JSON response
    return new VoteResponse(
            participationId,
            updatedCount,
            !alreadyVoted
    );
}


}
