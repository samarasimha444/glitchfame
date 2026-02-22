package com.example.glitchfame.Controller.adminController.AdminSeasonController;
import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.Service.AdminService.AdminSeasonService.CreateSeasonService;
import com.example.glitchfame.dto.AdminDTO.AdminSeasonDTO.SeasonRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/seasons")
@RequiredArgsConstructor
public class CreateSeasonController {

    private final CreateSeasonService adminSeasonService;

    @PostMapping
    public Seasons createSeason(@RequestBody SeasonRequestDTO dto) {
        return adminSeasonService.createSeason(dto);
    }
}