package com.example.backend.votes;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VoteAsyncService {

    private final VoteRepo voteRepo;

    @Async
    public void persistVote(boolean voted, UUID participationId, UUID authId) {

        if (voted) {

            // avoid duplicate insert if async runs twice
            if (!voteRepo.existsByParticipationIdAndAuthId(participationId, authId)) {

                Vote vote = Vote.builder()
                        .participationId(participationId)
                        .authId(authId)
                        .build();

                voteRepo.save(vote);
            }

        } else {

            voteRepo.deleteByParticipationIdAndAuthId(participationId, authId);

        }
    }
}