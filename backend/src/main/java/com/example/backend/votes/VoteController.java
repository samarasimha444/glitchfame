package com.example.backend.votes;

import com.example.backend.votes.dto.VoteDTO;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping
    public boolean toggleVote(Authentication authentication,
                              @RequestBody VoteDTO dto) {

        UUID authId = (UUID) authentication.getPrincipal();

        return voteService.toggleVote(
                dto.participationId(),
                dto.seasonId(),
                authId
        );
    }
}