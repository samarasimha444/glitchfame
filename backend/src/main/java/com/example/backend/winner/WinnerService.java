package com.example.backend.winner;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.winner.dto.WinnerDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WinnerService {

    private final WinnerRepo winnerRepo;

    public List<WinnerDTO> getWinners() {
        return winnerRepo.getPastSeasonWinners();
    }
}