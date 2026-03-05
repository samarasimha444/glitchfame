package com.example.glitchfame.Winner;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/winners")
@RequiredArgsConstructor
public class WinnerController {

    private final WinnerService winnerService;

    // get winners of all seasons
    @GetMapping
    public ResponseEntity<List<WinnerDTO>> getAllSeasonWinners() {

        List<WinnerDTO> winners = winnerService.getAllSeasonWinners();

        return ResponseEntity.ok(winners);
    }

    // get winner of specific season
    @GetMapping("/season/{seasonId}")
    public ResponseEntity<List<WinnerDTO>> getSeasonWinner(
            @PathVariable Long seasonId) {

        List<WinnerDTO> winner = winnerService.getSeasonWinner(seasonId);

        return ResponseEntity.ok(winner);
    }
}