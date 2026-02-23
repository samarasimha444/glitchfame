package com.example.glitchfame.Controller.UserController;

import com.example.glitchfame.Service.UserService.DashboardService;
import com.example.glitchfame.dto.UserDTO.SeasonDashboardProjection;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<List<SeasonDashboardProjection>> getDashboard(
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName(); // comes from JWT subject

        List<SeasonDashboardProjection> response =
                dashboardService.getDashboardSeasons(email);

        return ResponseEntity.ok(response);
    }
}