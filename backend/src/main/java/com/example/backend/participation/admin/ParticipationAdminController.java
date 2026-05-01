package com.example.backend.participation.admin;
import com.example.backend.participation.admin.dto.*;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
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
          @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
    ) {
        return participationAdminService.getLiveParticipantsByStatus(
                status,
                page,
                size
        );
    }



    //search by name in live season filter by participant status(approved/rejected/pending)
  @GetMapping("/search")
public Page<ParticipantsByStatus> searchParticipants(
        @RequestParam String name,
        @RequestParam(required = false) String status,
        @RequestParam(defaultValue = "desc") String order, // 👈 NEW
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
) {
    return participationAdminService.searchParticipants(name, status, order, page, size);
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



    //delete participation
  @DeleteMapping("/{id}")
public ResponseEntity<String> deleteParticipant(@PathVariable UUID id) {
    String message = participationAdminService.deleteParticipation(id);
    return ResponseEntity.ok(message); // 200 with message
}
    
}