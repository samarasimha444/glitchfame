package com.example.glitchfame.Controller.adminController;

import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.Service.AdminService.AdminSeasonService;
import com.example.glitchfame.dto.AdminDTO.SeasonRequestDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/seasons")
@RequiredArgsConstructor
public class AdminSeasonController {

    private final AdminSeasonService adminSeasonService;

    @PostMapping
    public Seasons createSeason(@RequestBody SeasonRequestDTO dto) {
        return adminSeasonService.createSeason(dto);
    }
}