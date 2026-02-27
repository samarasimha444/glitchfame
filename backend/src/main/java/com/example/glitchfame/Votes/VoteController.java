package com.example.glitchfame.Votes;

import com.example.glitchfame.Votes.DTO.VoteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;









@RestController
@RequestMapping("/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping("/toggle/{participationId}")
    public ResponseEntity<VoteResponse> toggleVote(
            @PathVariable Long participationId) {

        return ResponseEntity.ok(
                voteService.toggleVote(participationId)
        );
    }
}