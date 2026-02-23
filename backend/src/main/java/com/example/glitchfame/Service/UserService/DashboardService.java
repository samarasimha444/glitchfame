package com.example.glitchfame.Service.UserService;

import com.example.glitchfame.Repository.UserRepository.DashboardSeasonRepository;
import com.example.glitchfame.dto.UserDTO.SeasonDashboardProjection;
import com.example.glitchfame.Repository.AuthRepository.LoginRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardSeasonRepository seasonRepository;
    private final LoginRepository userRepository;

    @Transactional(readOnly = true)
    public List<SeasonDashboardProjection> getDashboardSeasons(String email) {

        Long userId = userRepository.findIdByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return seasonRepository.getDashboardSeasons(userId);
    }
}