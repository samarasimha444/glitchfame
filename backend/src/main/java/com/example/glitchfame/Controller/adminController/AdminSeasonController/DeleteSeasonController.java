package com.example.glitchfame.Controller.adminController.AdminSeasonController;
import com.example.glitchfame.Service.AdminService.AdminSeasonService.DeleteSeasonService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/seasons")
@RequiredArgsConstructor
public class DeleteSeasonController {

    private final DeleteSeasonService deleteSeasonService;

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSeason(@PathVariable Long id) {

        deleteSeasonService.softDeleteSeason(id);

        return ResponseEntity.ok("Season deleted successfully.");
    }
}