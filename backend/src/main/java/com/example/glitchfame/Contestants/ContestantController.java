package com.example.glitchfame.Contestants;
import com.example.glitchfame.Contestants.DTO.ContestantsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.example.glitchfame.Contestants.DTO.ContestantsStatusDTO;


@RestController
@RequestMapping("/contestants")
@RequiredArgsConstructor
public class ContestantController {

    private final ContestantService contestantService;

    @GetMapping("/approved")
    public ResponseEntity<List<ContestantsDTO>> getApproved() {
        return ResponseEntity.ok(
                contestantService.getAllApprovedContestants()
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ContestantsStatusDTO>> getPending() {
        return ResponseEntity.ok(
                contestantService.getAllPendingContestants()
        );
    }

    @GetMapping("/rejected")
    public ResponseEntity<List<ContestantsStatusDTO>> getRejected() {
        return ResponseEntity.ok(
                contestantService.getAllRejectedContestants()
        );
    }
}