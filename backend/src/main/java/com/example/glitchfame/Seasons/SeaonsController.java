package com.example.glitchfame.Seasons;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.glitchfame.Seasons.DTO.SeasonsByNameDTO;
import com.example.glitchfame.Seasons.DTO.SeasonDetailsDTO;
import com.example.glitchfame.Seasons.DTO.SeasonsDTO;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;


    
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
    public ResponseEntity<SeasonDetailsDTO> getSeasonDetails(
            @PathVariable Long seasonId
    )    {
                    SeasonDetailsDTO season =
                seasonsService.getSeasonDetails(seasonId);

        return ResponseEntity.ok(season);}





@GetMapping("/search/{name}")
public ResponseEntity<List<SeasonsByNameDTO>> searchSeasons(
        @PathVariable String name
) {
    return ResponseEntity.ok(
            seasonsService.searchSeasonsByName(name)
    );
}






 @DeleteMapping("/delete/{id}")
    public void deleteSeason(@PathVariable Long id) {
        seasonsService.deleteSeasonById(id);
    }



}
    

