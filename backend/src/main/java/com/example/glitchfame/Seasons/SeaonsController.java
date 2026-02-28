package com.example.glitchfame.Seasons;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.glitchfame.Seasons.DTO.SeasonsByNameDTO;
import com.example.glitchfame.Seasons.DTO.SeasonDetailsDTO;
import com.example.glitchfame.Seasons.DTO.SeasonFormDTO;
import com.example.glitchfame.Seasons.DTO.SeasonsDTO;
import com.example.glitchfame.Seasons.DTO.UpdateSeasonDTO;
import org.springframework.web.bind.annotation.PathVariable;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;






@RestController
@RequestMapping("/seasons")
@RequiredArgsConstructor

public class SeaonsController {
       
    
    private final SeasonsService seasonsService;
     
     // Get upcoming, live, and past seasons for the authenticated user
    // upcoming seasons order by registration start date ascending
    @GetMapping("/upcoming")
    public List<SeasonsDTO> upcoming() {
        return seasonsService.getUpcomingSeasons();
    }



    // live seasons order by registration end date ascending
     @GetMapping("/live")
     public List<SeasonsDTO> live() {
        return seasonsService.getLiveSeasons();
    }



   // past seasons order by voting end date descending
    @GetMapping("/past")
    public List<SeasonsDTO> past() {
        return seasonsService.getPastSeasons();
    }




    // Season details by id
      @GetMapping("/{seasonId}")
    public ResponseEntity<SeasonDetailsDTO> getSeasonDetails(@PathVariable Long seasonId

    ){  SeasonDetailsDTO season =
                seasonsService.getSeasonDetails(seasonId);
        return ResponseEntity.ok(season);}




// Search seasons by name (partial match)
@GetMapping("/search/{name}")
public ResponseEntity<List<SeasonsByNameDTO>> searchSeasons(
        @PathVariable String name
) {
    return ResponseEntity.ok(
            seasonsService.searchSeasonsByName(name)
    );
}




// Admin: Create season
@PostMapping(value = "/admin/seasons", consumes = "multipart/form-data")
public ResponseEntity<String> createSeason(
        @ModelAttribute @Valid SeasonFormDTO dto
) {
    return ResponseEntity.ok(seasonsService.createSeason(dto));
}




// Admin: Update season
@PatchMapping(value = "/admin/update/{id}", consumes = "multipart/form-data")
public ResponseEntity<String> updateSeason(
        @PathVariable Long id,
        @ModelAttribute UpdateSeasonDTO dto) {
    return ResponseEntity.ok(
            seasonsService.updateSeason(id, dto)
        );
}




// Admin: Delete season by id
@DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSeason(@PathVariable Long id) {
        seasonsService.deleteSeasonById(id);
        return ResponseEntity.ok("Season deleted successfully");
    }}
    

