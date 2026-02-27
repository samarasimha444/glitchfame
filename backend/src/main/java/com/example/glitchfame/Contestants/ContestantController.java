package com.example.glitchfame.Contestants;
import com.example.glitchfame.Contestants.DTO.ContestantByName;
import com.example.glitchfame.Contestants.DTO.ContestantsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.example.glitchfame.Contestants.DTO.ContestantsStatusDTO;
import com.example.glitchfame.Contestants.DTO.CreateContestantDTO;
import com.example.glitchfame.Contestants.DTO.SeasonContestants;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/contestants")
@RequiredArgsConstructor
public class ContestantController {

private final ContestantService contestantService;

  // Approved contestants
  @GetMapping("/approved")
    public ResponseEntity<List<ContestantsDTO>> getApprovedContestants() {
              List<ContestantsDTO> contestants =
                contestantService.getAllApprovedContestants();
        return ResponseEntity.ok(contestants);
    }




    // Pending contestants
    @GetMapping("/pending")
    public ResponseEntity<List<ContestantsStatusDTO>> getPending() {
        return ResponseEntity.ok(
                contestantService.getAllPendingContestants()
        );
    }




   
    // Rejected contestants
    @GetMapping("/rejected")
    public ResponseEntity<List<ContestantsStatusDTO>> getRejected() {
        return ResponseEntity.ok(
                contestantService.getAllRejectedContestants()
        );
    }



 

    // ✅ Create contestant (User apply for season)
   @PostMapping("/apply")
public ResponseEntity<String> createContestant(
        @ModelAttribute CreateContestantDTO request
) {

    String response = contestantService.createContestant(request);

    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
}





      // ✅ Get contestants of a season with vote info
       @GetMapping("/{seasonId}")
    public ResponseEntity<List<SeasonContestants>> getSeasonContestants(
            @PathVariable Long seasonId
    ) 
    {
             List<SeasonContestants> contestants =
                contestantService.getSeasonContestants(seasonId);

        return ResponseEntity.ok(contestants);
    }

  
//search contestants by name
    @GetMapping("search/{name}")
public ResponseEntity<List<ContestantByName>> searchContestants(
        @PathVariable String name
) {

    List<ContestantByName> results =
            contestantService.searchContestantsByName(name);

    return ResponseEntity.ok(results);
}



//get contestant details by id
@GetMapping("/details/{id}")
public ResponseEntity<ContestantsDTO> getContestantDetails(
        @PathVariable Long id
) {
    return ResponseEntity.ok(
            contestantService.getApprovedContestantById(id)
    );
}




//delete participation
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteParticipation(@PathVariable Long id) {
        String response = contestantService.deleteParticipationById(id);
        return ResponseEntity.ok(response);
    }
}