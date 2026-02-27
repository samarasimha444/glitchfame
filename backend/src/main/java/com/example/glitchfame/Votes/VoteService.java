package com.example.glitchfame.Votes;

import com.example.glitchfame.Votes.DTO.VoteResponse;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import com.example.glitchfame.Auth.User;
import com.example.glitchfame.Auth.AuthRepository;
import com.example.glitchfame.Contestants.Participation;
import com.example.glitchfame.Contestants.ContestantRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VotesRepository votesRepository;
    private final ContestantRepository contestantRepository;
    private final AuthRepository userRepository;
    private final ExtractJwtData extractJwtData;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public VoteResponse toggleVote(Long participationId) {

        Long userId = extractJwtData.getUserId();

        boolean alreadyVoted =
                votesRepository.existsByContestant_IdAndVoter_Id(
                        participationId, userId);

        if (alreadyVoted) {
            votesRepository.deleteByContestant_IdAndVoter_Id(
                    participationId, userId);
        } else {
            Participation participation =
                    contestantRepository.getReferenceById(participationId);

            User user =
                    userRepository.getReferenceById(userId);

            Vote vote = Vote.builder()
                    .contestant(participation)
                    .voter(user)
                    .build();

            votesRepository.save(vote);
        }

        long updatedCount =
                votesRepository.countByContestant_Id(participationId);

        // 🔥 Broadcast only global data
        messagingTemplate.convertAndSend(
                "/topic/votes",
                Map.of(
                        "participationId", participationId,
                        "voteCount", updatedCount
                )
        );

        return new VoteResponse(
                participationId,
                updatedCount,
                !alreadyVoted
        );
    }
}