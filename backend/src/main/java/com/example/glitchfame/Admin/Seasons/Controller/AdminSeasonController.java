package com.example.glitchfame.Admin.Seasons.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import com.example.glitchfame.Admin.Contestants.AdminContestantRepository;
import com.example.glitchfame.Admin.Seasons.DTO.SeasonFormDTO;
import com.example.glitchfame.Admin.Seasons.DTO.UpdateSeasonDTO;
import com.example.glitchfame.Admin.Seasons.Service.AdminSeasonService;
import com.example.glitchfame.User.Seasons.DTO.SeasonsDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/seasons")
@RequiredArgsConstructor
public class AdminSeasonController {

    private final AdminSeasonService service;
    private final AdminContestantRepository contestantRepository;

    // ================= GET SEASONS =================
    @GetMapping
    public ResponseEntity<Page<SeasonsDTO>> getSeasons(
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(service.getSeasons(status, page, size));
    }

    // ================= SEARCH SEASONS =================
    @GetMapping("/search")
    public ResponseEntity<Page<SeasonsDTO>> search(
            @RequestParam String name,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(service.search(name, status, page, size));
    }

    // ================= CREATE SEASON =================
    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<String> createSeason(
            @ModelAttribute @Valid SeasonFormDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.createSeason(dto));
    }

    // ================= UPDATE SEASON =================
    @PatchMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<String> updateSeason(
            @PathVariable Long id,
            @ModelAttribute UpdateSeasonDTO dto) {

        return ResponseEntity.ok(service.updateSeason(id, dto));
    }

    // ================= END SEASON NOW =================
    @PostMapping("/{seasonId}/end-now")
    public ResponseEntity<String> endSeasonNow(@PathVariable Long seasonId) {

        return ResponseEntity.ok(
                service.endSeasonNow(seasonId)
        );
    }

    // ================= RESET SEASON =================
    @DeleteMapping("/reset/{seasonId}")
    public ResponseEntity<String> resetSeason(@PathVariable Long seasonId) {

        service.resetSeason(seasonId);

        return ResponseEntity.ok("Season reset successfully");
    }

    // ================= DELETE SEASON =================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSeason(@PathVariable Long id) {

        return ResponseEntity.ok(service.deleteSeasonById(id));
    }
}