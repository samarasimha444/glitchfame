package com.example.glitchfame.Admin.Votes;
import com.example.glitchfame.User.Leadboard.LeaderboardService;
import com.example.glitchfame.User.Contestants.Participation;
import com.example.glitchfame.User.Contestants.ContestantRepository;
import com.example.glitchfame.User.Votes.VotesRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminVoteService {

    private final AdminVotesRepository adminVotesRepository;
    private final ContestantRepository participationRepository;
    private final VotesRepository votesRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final LeaderboardService leaderboardService;

@Transactional
public String adjustVotes(Long participationId, int value) {

    if (participationId == null) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Participation id is required"
        );
    }

    Participation participation = participationRepository
            .findById(participationId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Participation not found"
            ));
            

    // get admin vote row
    AdminVotes adminVotes = adminVotesRepository
            .findByParticipationId(participationId)
            .orElseGet(() -> AdminVotes.builder()
                    .participationId(participationId)
                    .adminVoteCount(0)
                    .build());

    // get current total votes
    Long currentTotalVotes = votesRepository.getTotalVotes(participationId);

    if (currentTotalVotes == null) {
        currentTotalVotes = 0L;
    }

    // check new total votes
    long newTotalVotes = currentTotalVotes + value;

    if (newTotalVotes < 0) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Total votes cannot be negative"
        );
    }

    // update admin vote adjustment
    int updatedAdminVotes = adminVotes.getAdminVoteCount() + value;
    adminVotes.setAdminVoteCount(updatedAdminVotes);

    adminVotesRepository.save(adminVotes);

    Long seasonId = participation.getSeason().getId();

    // broadcast vote update
    messagingTemplate.convertAndSend(
            "/topic/votes",
            Map.of(
                    "participationId", participationId,
                    "voteCount", newTotalVotes
            )
    );

    // update leaderboard
    leaderboardService.broadcastTop3Leaderboard(seasonId);

    return "Admin votes updated successfully";
}

}