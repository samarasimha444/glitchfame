package com.example.backend.votes.user;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.backend.votes.user.dto.ActionDTO;

import java.util.UUID;
@RestController
@RequestMapping("/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping
    public String action(Authentication authentication,
                         @RequestBody ActionDTO dto) {

        UUID authId = (UUID) authentication.getPrincipal();

        return voteService.performAction(
                dto.participationId(),
                dto.seasonId(),
                authId,
                dto.action()
        );
    }
}