package com.example.glitchfame.Admin.Seasons.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.example.glitchfame.Admin.Seasons.Service.SeasonUpdateService;

@RestController
@RequestMapping("/admin/seasons")
@RequiredArgsConstructor
public class AdminSeasonUpdateController {

    private final SeasonUpdateService service;

    // update prize money
    @PatchMapping("/{id}/prize-money")
    public ResponseEntity<String> updatePrizeMoney(
            @PathVariable Long id,
            @RequestParam BigDecimal prizeMoney) {

        return ResponseEntity.ok(service.updatePrizeMoney(id, prizeMoney));
    }

    // update registration dates
    @PatchMapping("/{id}/registration-dates")
    public ResponseEntity<String> updateRegistrationDates(
            @PathVariable Long id,
            @RequestParam(required = false) OffsetDateTime start,
            @RequestParam(required = false) OffsetDateTime end) {

        return ResponseEntity.ok(
                service.updateRegistrationDates(
                        id,
                        start != null ? start.toInstant() : null,
                        end != null ? end.toInstant() : null
                ));
    }

    // update voting dates
    @PatchMapping("/{id}/voting-dates")
    public ResponseEntity<String> updateVotingDates(
            @PathVariable Long id,
            @RequestParam(required = false) OffsetDateTime start,
            @RequestParam(required = false) OffsetDateTime end) {

        return ResponseEntity.ok(
                service.updateVotingDates(
                        id,
                        start != null ? start.toInstant() : null,
                        end != null ? end.toInstant() : null
                ));
    }

    // toggle vote lock
    @PatchMapping("/{id}/vote-lock")
    public ResponseEntity<String> toggleVoteLock(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleVoteLock(id));
    }

    // toggle participation lock
    @PatchMapping("/{id}/participation-lock")
    public ResponseEntity<String> toggleParticipationLock(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleParticipationLock(id));
    }

    // toggle season lock
    @PatchMapping("/{id}/season-lock")
    public ResponseEntity<String> toggleSeasonLock(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleSeasonLock(id));
    }
}