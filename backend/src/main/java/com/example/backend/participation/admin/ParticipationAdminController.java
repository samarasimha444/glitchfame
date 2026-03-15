package com.example.backend.participation.admin;

import com.example.backend.participation.admin.dto.*;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin/participations")
@RequiredArgsConstructor
public class ParticipationAdminController {

    private final ParticipationAdminService participationAdminService;


    // get participants from LIVE seasons filtered by status
    @GetMapping("/live")
    public Page<ParticipantsByStatus> getLiveParticipantsByStatus(
            @RequestParam String status,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return participationAdminService.getLiveParticipantsByStatus(
                status,
                page,
                size
        );
    }


    // search LIVE approved participants by name
    @GetMapping("/live/search")
    public Page<ParticipantsByStatus> searchLiveApprovedParticipants(
            @RequestParam String name,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return participationAdminService.searchLiveApprovedParticipants(
                name,
                page,
                size
        );
    }


    // admin updates participant status
    @PatchMapping("/{participationId}/status")
    public void updateParticipationStatus(
            @PathVariable UUID participationId,
            @RequestParam String status
    ) {
        participationAdminService.updateParticipationStatus(
                participationId,
                status
        );
    }
    
}