package com.example.glitchfame.Contestants;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;

import com.example.glitchfame.Contestants.DTO.ContestantsDTO;
import com.example.glitchfame.Contestants.DTO.CreateContestantDTO;

@RestController
@RequestMapping("/contestants")
@RequiredArgsConstructor
public class ContestantController {

    private final ContestantService contestantService;

    // ==========================================================
    // UNIVERSAL FILTER ENDPOINT
    //
    // Examples:
    // /contestants?status=APPROVED
    // /contestants?seasonId=5
    // /contestants?seasonId=5&status=PENDING
    // /contestants?name=raj
    // /contestants?liveOnly=true
    // /contestants?seasonId=5&name=raj&status=APPROVED
    // ==========================================================

    @GetMapping
    public ResponseEntity<Page<ContestantsDTO>> getContestants(
            @RequestParam(required = false) Long seasonId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false, defaultValue = "false") Boolean liveOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(
                contestantService.getContestants(
                        seasonId,
                        name,
                        status,
                        liveOnly,
                        page,
                        size
                )
        );
    }

    // ==========================================================
    // GET BY ID
    // /contestants/{id}
    // ==========================================================

    @GetMapping("/{id}")
    public ResponseEntity<ContestantsDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(
                contestantService.getById(id)
        );
    }

   
    // APPLY FOR SEASON
    @PostMapping("/apply")
    public ResponseEntity<String> apply(
            @ModelAttribute CreateContestantDTO request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(contestantService.createContestant(request));
    }



    // ==========================================================
    // UPDATE STATUS (APPROVE / REJECT)
    //
    // Example:
    // PATCH /contestants/admin/12?action=APPROVE
    // PATCH /contestants/admin/12?action=REJECT
    // ==========================================================


    
    @PatchMapping("/admin/{id}")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long id,
            @RequestParam String action) {

        return ResponseEntity.ok(
                contestantService.updateStatus(id, action)
        );
    }

    // ==========================================================
    // DELETE PARTICIPATION
    // ==========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return ResponseEntity.ok(
                contestantService.delete(id)
        );
    }
}