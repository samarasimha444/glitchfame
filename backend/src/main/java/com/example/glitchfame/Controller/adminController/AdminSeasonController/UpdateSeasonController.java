package com.example.glitchfame.Controller.adminController.AdminSeasonController;
import com.example.glitchfame.Service.AdminService.AdminSeasonService.UpdateSeasonService;
import com.example.glitchfame.dto.AdminDTO.AdminSeasonDTO.UpdateSeasonDTO;
import com.example.glitchfame.dto.AdminDTO.AdminSeasonDTO.GetSeasonDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/seasons")
@RequiredArgsConstructor
public class UpdateSeasonController {

    private final UpdateSeasonService updateSeasonService;

    @PutMapping("/{id}")
    public ResponseEntity<GetSeasonDTO> updateSeason(
            @PathVariable Long id,
            @RequestBody UpdateSeasonDTO dto) {

        return ResponseEntity.ok(
                updateSeasonService.updateSeason(id, dto)
        );
    }
}