package com.example.backend.votes.admin;

import com.example.backend.votes.admin.dto.AdminVoteDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/votes")
@RequiredArgsConstructor
public class AdminVoteController {

    private final AdminVoteService adminVoteService;

    @PostMapping
    public long adjustScore(@RequestBody AdminVoteDTO request) {

        return adminVoteService.adjustScore(
                request.getSeasonId(),          // ✅ REQUIRED
                request.getParticipationId(),
                request.getScoreDelta()
        );
    }
}