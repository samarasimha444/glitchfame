package com.example.glitchfame.Controller.UserController;

import com.example.glitchfame.Service.UserService.UserSeasonService;
import com.example.glitchfame.dto.UserDTO.SeasonDashboardDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/seasons")
@RequiredArgsConstructor
public class UserSeasonController {

    private final UserSeasonService userSeasonService;

    @GetMapping
    public List<SeasonDashboardDTO> getAllSeasons() {
        return userSeasonService.getAllSeasons();
    }
}