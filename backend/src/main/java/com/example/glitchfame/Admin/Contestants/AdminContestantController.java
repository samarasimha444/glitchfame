package com.example.glitchfame.Admin.Contestants;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.glitchfame.User.Contestants.DTO.ContestantsDTO;
import com.example.glitchfame.User.Contestants.DTO.SeasonContestants;
import com.example.glitchfame.User.Contestants.DTO.ContestantByName;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/admin/contestants")
@RequiredArgsConstructor
public class AdminContestantController {

    private final AdminContestantService service;

    @GetMapping
    public ResponseEntity<Page<ContestantsDTO>> getContestants(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(
                service.getContestants(status, page, size)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ContestantByName>> search(
            @RequestParam(required = false) Long seasonId,
            @RequestParam(required = false) String seasonType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(
                service.search(seasonId, seasonType, status, name, page, size)
        );
    }

    @GetMapping("/season/{seasonId}")
    public ResponseEntity<Page<SeasonContestants>> getSeasonContestants(
            @PathVariable Long seasonId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(
                service.getSeasonContestants(seasonId, status, page, size)
        );
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long id,
            @RequestParam String action) {

        return ResponseEntity.ok(
                service.updateStatus(id, action)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return ResponseEntity.ok(service.delete(id));
    }
}