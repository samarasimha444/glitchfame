package com.example.backend.participation;

import com.example.backend.participation.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.backend.seasons.dto.SeasonFullResponse;

import java.util.UUID;

@RestController
@RequestMapping("/participations")
@RequiredArgsConstructor
public class ParticipationController {

    private final ParticipationService participationService;


    // extract user id from JWT (safe fallback to null)
    private UUID extractAuthId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        try {
            return (UUID) authentication.getPrincipal();
        } catch (Exception e) {
            return null;
        }
    }


    // create participation (auth required)
    @PostMapping
    public void createParticipation(
            Authentication authentication,
            @RequestBody ParticipationForm form
    ) {

        UUID authId = extractAuthId(authentication);

        if (authId == null) {
            throw new IllegalStateException("Authentication required");
        }

        participationService.createParticipation(authId, form);
    }


    // get live contestants (auth optional)
    @GetMapping("/live")
    public Page<Participants> getLiveContestants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {

        UUID authId = extractAuthId(authentication);

        return participationService.getLiveContestants(authId, page, size);
    }


    // search live contestants
    @GetMapping("/search")
    public Page<Participants> searchLiveContestants(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {

        UUID authId = extractAuthId(authentication);

        return participationService.searchLiveContestants(
                name,
                authId,
                page,
                size
        );
    }


    // search contestants by season
    @GetMapping("/season/{seasonId}/search")
    public Page<Participants> searchParticipantsBySeason(
            @PathVariable UUID seasonId,
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {

        UUID authId = extractAuthId(authentication);

        return participationService.searchParticipantsBySeason(
                seasonId,
                name,
                authId,
                page,
                size
        );
    }


    // get participant details
    @GetMapping("/{participationId}")
    public ParticipantById getParticipantById(
            @PathVariable UUID participationId,
            Authentication authentication
    ) {

        UUID authId = extractAuthId(authentication);
        return participationService.getParticipationById(participationId, authId);
    }


    // get random live season + participants
    @GetMapping("/random-season")
    public SeasonFullResponse getRandomLiveSeason(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        UUID authId = extractAuthId(authentication);
    return participationService.getRandomLiveSeasonWithParticipants(
                authId,
                page,
                size
        );
    }


    // delete participation (auth required)
    @DeleteMapping("/{participationId}")
    public void deleteParticipation(
            Authentication authentication,
            @PathVariable UUID participationId
    ) {

        UUID authId = extractAuthId(authentication);
       if (authId == null) {
            throw new IllegalStateException("Authentication required");
        }

        participationService.deleteParticipation(participationId, authId);
    }
}