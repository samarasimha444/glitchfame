package com.example.backend.seasons;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;

import com.example.backend.seasons.dto.SeasonDetails;
import com.example.backend.seasons.dto.SeasonForm;
import com.example.backend.seasons.dto.SeasonFullResponse;

import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/seasons")
@RequiredArgsConstructor
public class SeasonController {

    private final seasonService seasonService; // service


    // create season
  @PostMapping
public String createSeason(@RequestBody SeasonForm form) {

    seasonService.createSeason(form);

    return "Season created successfully";
}

    // delete season by id
    @DeleteMapping("/{seasonId}")
    public String deleteSeason(@PathVariable UUID seasonId) {

        seasonService.deleteSeason(seasonId);

        return "Season deleted successfully";
    }






//season lock
 @PatchMapping("/{seasonId}/season-lock")
    public String toggleSeasonLock(@PathVariable UUID seasonId) {

        boolean locked = seasonService.toggleSeasonLock(seasonId);

        if (locked) {
            return "Season locked successfully";
        } else {
            return "Season unlocked successfully";
        }
    }




    // adjust season dates
    @PatchMapping("/{seasonId}/adjust-dates")
    public String adjustDates(
            @PathVariable UUID seasonId,
            @RequestParam(required = false) OffsetDateTime registrationStart,
            @RequestParam(required = false) OffsetDateTime registrationEnd,
            @RequestParam(required = false) OffsetDateTime votingStart,
            @RequestParam(required = false) OffsetDateTime votingEnd) {

        seasonService.adjustDates(seasonId, registrationStart, registrationEnd, votingStart, votingEnd);

        return "Season dates updated successfully";
    }





    // update prize money
    @PatchMapping("/{seasonId}/prize")
    public String updatePrize(
            @PathVariable UUID seasonId,
            @RequestParam String prize) {

        seasonService.updatePrize(seasonId, prize);

        return "Prize updated successfully";
    }



//get season  Live/upmcing/past/live-upcpming
@GetMapping
public Page<SeasonDetails> getSeasons(
        Authentication authentication,
        @RequestParam(defaultValue = "ALL") String type,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
) {

    UUID authId = UUID.fromString(authentication.getName()); // authId from JWT
     return seasonService.getSeasons(authId, type, page, size);
}


@GetMapping("/{seasonId}")
public ResponseEntity<SeasonFullResponse> getSeasonFull(
        @PathVariable UUID seasonId,
        Authentication authentication,
        @PageableDefault(size = 10) Pageable pageable
) {

    UUID authId = UUID.fromString(authentication.getName()); // get user id

    return ResponseEntity.ok(
            seasonService.getSeasonFull(seasonId, authId, pageable)
    );
}







    // end season (set votingEnd = now)
@PostMapping("/{seasonId}/end")
public String endSeason(@PathVariable UUID seasonId) {
 seasonService.endSeason(seasonId, Instant.now());
return "Season ended successfully";
    }



// reset season (delete all participations but keep season)
@PostMapping("/{seasonId}/reset")
public String resetSeason(@PathVariable UUID seasonId) {
seasonService.resetSeason(seasonId);
return "Season reset successfully";
}
}