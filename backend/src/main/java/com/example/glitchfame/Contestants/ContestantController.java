package com.example.glitchfame.Contestants;
import com.example.glitchfame.Contestants.DTO.ContestantsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.example.glitchfame.Contestants.DTO.ContestantsStatusDTO;
import com.example.glitchfame.Contestants.DTO.CreateContestantDTO;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/contestants")
@RequiredArgsConstructor
public class ContestantController {

    private final ContestantService contestantService;




    // Approved contestants 
    @GetMapping("/approved")
    public ResponseEntity<List<ContestantsDTO>> getApproved() {
        return ResponseEntity.ok(
                contestantService.getAllApprovedContestants()
        );
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
            @RequestBody CreateContestantDTO request) {
        String response = contestantService.createContestant(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);

    }



    

    //delete participation
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteParticipation(@PathVariable Long id) {
        String response = contestantService.deleteParticipationById(id);
        return ResponseEntity.ok(response);
    }
}