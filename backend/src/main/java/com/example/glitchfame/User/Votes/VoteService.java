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
import java.util.Map;




@Service
@RequiredArgsConstructor
public class VoteService {

    private final VotesRepository votesRepository;
    private final ContestantRepository contestantRepository;
    private final AuthRepository userRepository;
    private final ExtractJwtData extractJwtData;
    private final SimpMessagingTemplate messagingTemplate;
    private final LeaderboardService leaderboardService; // 🔥 ADD THIS

    @Transactional
    public VoteResponse toggleVote(Long participationId) {

        Long userId = extractJwtData.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"));
        if (!user.isCanVote()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Voting access denied by admin."
            );
        }

         // 🔥 Always fetch participation FIRST
        Participation participation =
                contestantRepository.findById(participationId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Contestant not found"
                        ));

        Long seasonId = participation.getSeason().getId(); // 🔥 get seasonId once
         boolean alreadyVoted =
                votesRepository.existsByContestant_IdAndVoter_Id(
                        participationId, userId);

        if (alreadyVoted) {
            votesRepository.deleteByContestant_IdAndVoter_Id(
                    participationId, userId);
        } else {
            Vote vote = Vote.builder()
                    .contestant(participation)
                    .voter(user)
                    .build();
                votesRepository.save(vote);
        }

        long updatedCount =
                votesRepository.countByContestant_Id(participationId);

        // 🔥 Broadcast vote count update
        messagingTemplate.convertAndSend(
                "/topic/votes",
                Map.of(
                        "participationId", participationId,
                        "voteCount", updatedCount
                )
        );

        // 🔥 Broadcast leaderboard update
        leaderboardService.broadcastLeaderboard(seasonId);
         return new VoteResponse(
                participationId,
                updatedCount,
                !alreadyVoted
        );
    }
}