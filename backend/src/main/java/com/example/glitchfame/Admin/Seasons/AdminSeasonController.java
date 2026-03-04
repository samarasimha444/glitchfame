package com.example.glitchfame.Admin.Seasons;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import com.example.glitchfame.Admin.Seasons.DTO.SeasonFormDTO;
import com.example.glitchfame.Admin.Seasons.DTO.UpdateSeasonDTO;
import com.example.glitchfame.User.Seasons.DTO.SeasonsDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/seasons")
@RequiredArgsConstructor
public class AdminSeasonController {

    private final AdminSeasonService service;

    // Get seasons with optional status filter
    @GetMapping
    public ResponseEntity<Page<SeasonsDTO>> getSeasons(
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(service.getSeasons(status, page, size));
    }

    // Search seasons by name and status
    @GetMapping("/search")
    public ResponseEntity<Page<SeasonsDTO>> search(
            @RequestParam String name,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(service.search(name, status, page, size));
    }

    // Create a new season
    @PostMapping( value = "/create",   consumes = "multipart/form-data")
    public ResponseEntity<String> createSeason(
            @ModelAttribute @Valid SeasonFormDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.createSeason(dto));
    }

    // Update season details
    @PatchMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<String> updateSeason(
            @PathVariable Long id,
            @ModelAttribute UpdateSeasonDTO dto) {

        return ResponseEntity.ok(service.updateSeason(id, dto));
    }

    // Delete season by id
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSeason(@PathVariable Long id) {
        return ResponseEntity.ok(service.deleteSeasonById(id));
    }
}