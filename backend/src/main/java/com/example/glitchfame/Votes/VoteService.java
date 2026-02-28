package com.example.glitchfame.Votes;
import com.example.glitchfame.Votes.DTO.VoteResponse;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import com.example.glitchfame.Auth.User;
import com.example.glitchfame.Auth.AuthRepository;
import com.example.glitchfame.Contestants.Participation;
import com.example.glitchfame.Contestants.ContestantRepository;
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

    @Transactional
    public VoteResponse toggleVote(Long participationId) {

        Long userId = extractJwtData.getUserId();

        // 🔒 Fetch user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        // 🚫 Check voting permission
        if (!user.isCanVote()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Voting access denied by admin."
            );
        }

        // 🔍 Check if already voted
        boolean alreadyVoted =
                votesRepository.existsByContestant_IdAndVoter_Id(
                        participationId, userId);

        if (alreadyVoted) {
            votesRepository.deleteByContestant_IdAndVoter_Id(
                    participationId, userId);
        } else {

            Participation participation =
                    contestantRepository.findById(participationId)
                            .orElseThrow(() -> new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Contestant not found"
                            ));

            Vote vote = Vote.builder()
                    .contestant(participation)
                    .voter(user)
                    .build();

            votesRepository.save(vote);
        }

        long updatedCount =
                votesRepository.countByContestant_Id(participationId);

        // 📡 Broadcast updated vote count
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