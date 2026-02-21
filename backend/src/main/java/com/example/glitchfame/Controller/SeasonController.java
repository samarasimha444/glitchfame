package com.example.glitchfame.Controller;
import com.example.glitchfame.dto.SeasonRequestDTO;
import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.Service.SeasonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController

@RequiredArgsConstructor

public class SeasonController {

    private final SeasonService seasonService;

    @PostMapping("/api/seasons")
    public ResponseEntity<Seasons> createSeason(@RequestBody SeasonRequestDTO dto) {

        Seasons savedSeason = seasonService.createSeason(dto);

        return ResponseEntity.status(201).body(savedSeason);
    }
    


    @GetMapping("/seasons")
    public ResponseEntity<List<Seasons>> getAllSeasons() {
    return ResponseEntity.ok(seasonService.getAllSeasons());
}
}
