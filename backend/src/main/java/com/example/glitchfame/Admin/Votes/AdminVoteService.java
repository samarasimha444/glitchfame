package com.example.glitchfame.Admin.Votes;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class AdminVoteService {

    private final AdminVotesRepository adminVotesRepository;

    @Transactional
    public String adjustVotes(Long participationId, int value) {

        if (participationId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Participation id is required"
            );
        }

        AdminVotes adminVotes = adminVotesRepository
                .findByParticipationId(participationId)
                .orElseGet(() -> AdminVotes.builder()
                        .participationId(participationId)
                        .adminVoteCount(0)
                        .build());

        int updatedCount = adminVotes.getAdminVoteCount() + value;

        adminVotes.setAdminVoteCount(updatedCount);

        adminVotesRepository.save(adminVotes);

        return "Admin votes updated successfully";
    }
}