package com.example.glitchfame.Seasons;
import com.example.glitchfame.Seasons.DTO.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/seasons")
@RequiredArgsConstructor
public class SeasonsController {

    private final SeasonsService seasonsService;

    /*
     -------------------------------------------------
     1️⃣ GET SEASONS BY STATUS
     Example:
     /seasons?status=LIVE
     /seasons?status=PAST
     /seasons?status=UPCOMING
     -------------------------------------------------
    */
   @GetMapping
public ResponseEntity<List<SeasonsDTO>> getSeasons(
        @RequestParam(required = false) String status) {

    return ResponseEntity.ok(
            seasonsService.getSeasons(status)
    );
}



    
    // 2️⃣ GET SEASON DETAILS
    
    @GetMapping("/{seasonId}")
    public ResponseEntity<SeasonDetailsDTO> getSeasonDetails(
            @PathVariable Long seasonId) {

        return ResponseEntity.ok(
                seasonsService.getSeasonDetails(seasonId)
        );
    }

    /*
     -------------------------------------------------
     3️⃣ SEARCH SEASONS (Autocomplete)
     Example:
     /seasons/search?name=Li
     -------------------------------------------------
    */
   @GetMapping("/search")
public ResponseEntity<List<SeasonsByNameDTO>> searchSeasons(
        @RequestParam String name,
        @RequestParam String status) {

    return ResponseEntity.ok(
            seasonsService.searchSeasonsByName(name, status)
    );
}

    
    // 4️⃣ CREATE SEASON (ADMIN)
     @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<String> createSeason(
            @ModelAttribute @Valid SeasonFormDTO dto) {

        return ResponseEntity.ok(
                seasonsService.createSeason(dto)
        );
    }



   //  5️⃣ UPDATE SEASON (ADMIN)
  @PatchMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<String> updateSeason(
            @PathVariable Long id,
            @ModelAttribute UpdateSeasonDTO dto) {

        return ResponseEntity.ok(
                seasonsService.updateSeason(id, dto)
        );
    }



    
    // 6️⃣ DELETE SEASON (ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSeason(
            @PathVariable Long id) {

        seasonsService.deleteSeasonById(id);
        return ResponseEntity.ok("Season deleted successfully");
    }
}