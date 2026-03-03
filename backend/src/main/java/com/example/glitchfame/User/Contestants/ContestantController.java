package com.example.glitchfame.User.Contestants;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.glitchfame.User.Contestants.DTO.*;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/contestants")
@RequiredArgsConstructor
public class ContestantController {

    private final ContestantService service;

    @GetMapping
    public ResponseEntity<Page<ContestantsDTO>> getContestants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(
                service.getContestants(page, size)
        );
    }


    

    //get by id
    @GetMapping("/{id}")
    public ResponseEntity<ContestantsDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }


   //search by name
    @GetMapping("/search")
public ResponseEntity<Page<ContestantByName>> searchByName(
        @RequestParam(required = false) String name,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {

    return ResponseEntity.ok(
            service.searchByName(name, page, size)
    );
}



@GetMapping("/season/{seasonId}")
public ResponseEntity<Page<SeasonContestants>> getSeasonContestants(
        @PathVariable Long seasonId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {

    return ResponseEntity.ok(
            service.getApprovedSeasonContestants(seasonId, page, size)
    );
}




   //apply
    @PostMapping("/apply")
    public ResponseEntity<String> apply(
            @ModelAttribute CreateContestantDTO request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.apply(request));
    }

  


    
    //get contestant of season by name in a season
    @GetMapping("/season/{seasonId}/search")
public ResponseEntity<Page<SeasonContestants>> searchSeasonContestants(
        @PathVariable Long seasonId,
        @RequestParam(required = false) String name,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {

    return ResponseEntity.ok(
            service.searchSeasonContestantsByName(
                    seasonId,
                    name,
                    page,
                    size
            )
    );
}




    //delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return ResponseEntity.ok(
                service.deleteMyParticipation(id)
        );
    }
}