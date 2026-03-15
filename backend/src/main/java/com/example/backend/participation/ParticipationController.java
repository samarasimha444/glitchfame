package com.example.backend.participation;

import com.example.backend.participation.dto.Participants;
import com.example.backend.participation.dto.ParticipantById;
import com.example.backend.participation.dto.ParticipationForm;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/participations")
@RequiredArgsConstructor
public class ParticipationController {

    private final ParticipationService participationService;

    // create or reapply participation
    @PostMapping
    public void createParticipation(
            Authentication authentication,
            @RequestBody ParticipationForm form
    ) {

        UUID authId = (UUID) authentication.getPrincipal();

        participationService.createParticipation(authId, form);
    }



    // get all approved participations of a season
    @GetMapping("/seasons/{seasonId}/participants")
    public Page<Participants> getParticipants(
            @PathVariable UUID seasonId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {

        UUID authId = (UUID) authentication.getPrincipal();

        return participationService.getApprovedParticipants(
                seasonId,
                authId,
                page,
                size
        );
    }



    // get all live approved contestants
    @GetMapping("/contestants/live")
    public Page<Participants> getLiveContestants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {
        System.out.println(authentication);

        UUID authId = (UUID) authentication.getPrincipal();

        return participationService.getLiveContestants(
                authId,
                page,
                size
        );
    }



    // search contestants across all live seasons
    @GetMapping("/contestants/search")
    public Page<Participants> searchLiveContestants(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {

        UUID authId = (UUID) authentication.getPrincipal();

        return participationService.searchLiveContestants(
                name,
                authId,
                page,
                size
        );
    }



    // search contestants inside a specific season
    @GetMapping("/seasons/{seasonId}/participants/search")
    public Page<Participants> searchParticipantsBySeason(
            @PathVariable UUID seasonId,
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {

        UUID authId = (UUID) authentication.getPrincipal();

        return participationService.searchParticipantsBySeason(
                seasonId,
                name,
                authId,
                page,
                size
        );
    }



    // get participant details by id
    @GetMapping("/{participationId}")
    public ParticipantById getParticipantById(
            @PathVariable UUID participationId,
            Authentication authentication
    ) {

        UUID authId = (UUID) authentication.getPrincipal();

        return participationService.getParticipationById(
                participationId,
                authId
        );
    }



    // delete participation
    @DeleteMapping("/{participationId}")
    public void deleteParticipation(
            Authentication authentication,
            @PathVariable UUID participationId
    ) {

        UUID authId = (UUID) authentication.getPrincipal();

        participationService.deleteParticipation(
                participationId,
                authId
        );
    }
}