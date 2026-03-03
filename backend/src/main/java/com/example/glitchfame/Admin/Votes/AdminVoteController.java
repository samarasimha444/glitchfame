package com.example.glitchfame.Admin.Votes;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/votes")
@RequiredArgsConstructor
public class AdminVoteController {

    private final AdminVoteService adminVoteService;

    @PatchMapping("/{participationId}")
    public ResponseEntity<String> adjustVotes(
            @PathVariable Long participationId,
            @RequestParam int value) {

        return ResponseEntity.ok(
                adminVoteService.adjustVotes(participationId, value)
        );
    }
}