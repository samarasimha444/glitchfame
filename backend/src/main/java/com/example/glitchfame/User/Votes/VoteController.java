package com.example.glitchfame.User.Votes;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.glitchfame.User.Votes.DTO.VoteResponse;


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