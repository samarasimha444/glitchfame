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

        // 🔥 Get logged-in user id
        Long userId = extractJwtData.getUserId();

        // 🔥 Fetch user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        // 🔥 Check if admin disabled voting for this user
        if (!user.isCanVote()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Voting access denied by admin."
            );
        }

        // 🔥 Fetch participation
        Participation participation = contestantRepository
                .findById(participationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Contestant not found"
                ));

        // 🔥 Get season
        var season = participation.getSeason();

        // 🔒 Check if entire season is locked
        if (season.isSeasonLock()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Season is closed."
            );
        }

        // 🔒 Check if voting is locked
        if (season.isVoteLock()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Voting for this season is closed."
            );
        }

        // 🔒 Check voting end date
        if (LocalDateTime.now().isAfter(season.getVotingEndDate())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Voting period has ended."
            );
        }

        // 🔥 Get season id
        Long seasonId = season.getId();

        // 🔥 Check if user already voted this contestant
        boolean alreadyVoted =
                votesRepository.existsByContestant_IdAndVoter_Id(
                        participationId, userId
                );

        // 🔥 Enforce max 5 votes per season (only when adding new vote)
        if (!alreadyVoted) {

            long votesInSeason =
                    votesRepository.countVotesByUserInSeason(
                            userId, seasonId
                    );

            if (votesInSeason >= 5) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You can only vote 5 times in this season."
                );
            }
        }

        // 🔥 Toggle vote
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

        // 🔥 Get updated vote count for this contestant
        long updatedCount =
                votesRepository.countByContestant_Id(participationId);

        // 🔥 Broadcast individual vote update
        messagingTemplate.convertAndSend(
                "/topic/votes",
                Map.of(
                        "participationId", participationId,
                        "voteCount", updatedCount
                )
        );

        // 🔥 Broadcast updated top 3 leaderboard
        leaderboardService.broadcastTop3Leaderboard(seasonId);

        // 🔥 Return response
        return new VoteResponse(
                participationId,
                updatedCount,
                !alreadyVoted
        );
    }
}