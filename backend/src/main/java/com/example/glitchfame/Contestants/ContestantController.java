package com.example.glitchfame.Contestants;
import com.example.glitchfame.Contestants.DTO.ContestantByName;
import com.example.glitchfame.Contestants.DTO.ContestantsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.example.glitchfame.Contestants.DTO.CreateContestantDTO;
import com.example.glitchfame.Contestants.DTO.SeasonContestants;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.data.domain.Page;





@RestController
@RequestMapping("/contestants")
@RequiredArgsConstructor
public class ContestantController {

    private final ContestantService contestantService;

 

//approved
@GetMapping("status/approved")
public ResponseEntity<Page<ContestantsDTO>> getApprovedContestants(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {

    return ResponseEntity.ok(
            contestantService.getContestantsByStatus(
                    "APPROVED",
                    page,
                    size
            ));}


//pending
@GetMapping("status/pending")
public ResponseEntity<Page<ContestantsDTO>> getPendingContestants(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {

    return ResponseEntity.ok(
            contestantService.getContestantsByStatus(
                    "PENDING",
                    page,
                    size
            ));}


//rejected 
@GetMapping("status/rejected")
public ResponseEntity<Page<ContestantsDTO>> getRejectedContestants(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {

    return ResponseEntity.ok(
            contestantService.getContestantsByStatus(
                    "REJECTED",
                    page,
                    size
            ));}




// ✅ Create contestant (User apply for season)
@PostMapping("/apply")
public ResponseEntity<String> createContestant(
        @ModelAttribute CreateContestantDTO request) {
        String response = contestantService.createContestant(request);
         return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);}




 // ✅ Get contestants of a season with vote info
       @GetMapping("season/{seasonId}")
    public ResponseEntity<List<SeasonContestants>> getSeasonContestants(
            @PathVariable Long seasonId) 
    {
        List<SeasonContestants> contestants =
        contestantService.getSeasonContestants(seasonId);
        return ResponseEntity.ok(contestants);}





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




//approve participation
@PatchMapping("/admin/{id}/approve")
public ResponseEntity<String> approve(@PathVariable Long id) {
    return ResponseEntity.ok(contestantService.approveParticipation(id));
}



//reject participation
@PatchMapping("/admin/{id}/reject")
public ResponseEntity<String> reject(@PathVariable Long id) {
    return ResponseEntity.ok(contestantService.rejectParticipation(id));
}



//delete participation
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteParticipation(@PathVariable Long id) {
        String response = contestantService.deleteParticipationById(id);
        return ResponseEntity.ok(response);
    }

}