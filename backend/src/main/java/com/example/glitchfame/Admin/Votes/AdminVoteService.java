package com.example.glitchfame.Admin.Votes;

import com.example.glitchfame.User.Leadboard.LeaderboardService;
import com.example.glitchfame.User.Contestants.Participation;
import com.example.glitchfame.User.Contestants.ContestantRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class AdminVoteService {

    private final AdminVotesRepository adminVotesRepository;
    private final ContestantRepository participationRepository;
    private final LeaderboardService leaderboardService;

    @Transactional
    public String adjustVotes(Long participationId, int value) {

        if (participationId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Participation id is required"
            );
        }

        // 🔥 Fetch participation to get seasonId
        Participation participation = participationRepository
                .findById(participationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Participation not found"
                ));

        // 🔥 Get or create admin vote record
        AdminVotes adminVotes = adminVotesRepository
                .findByParticipationId(participationId)
                .orElseGet(() -> AdminVotes.builder()
                        .participationId(participationId)
                        .adminVoteCount(0)
                        .build());

        int updatedCount = adminVotes.getAdminVoteCount() + value;
       if (updatedCount < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vote count cannot be negative"
            );
        }

        adminVotes.setAdminVoteCount(updatedCount);
        adminVotesRepository.save(adminVotes);

        // 🔥 Trigger WebSocket leaderboard refresh
        Long seasonId = participation.getSeason().getId();
        leaderboardService.broadcastTop3Leaderboard(seasonId);

        return "Admin votes updated successfully";
    }
}