package com.example.glitchfame.Contestants;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contestants")
public class ContestantController {

    private final ContestantService contestantService;

    public ContestantController(ContestantService contestantService) {
        this.contestantService = contestantService;
    }

    @GetMapping
    public ResponseEntity<List<ContestantsDTO>> getAllApprovedContestants() {
        return ResponseEntity.ok(
                contestantService.getAllApprovedContestants()
        );
    }
}