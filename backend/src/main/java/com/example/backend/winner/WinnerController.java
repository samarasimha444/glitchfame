package com.example.backend.winner;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.winner.dto.WinnerDTO;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/winners")
@RequiredArgsConstructor
public class WinnerController {

    private final WinnerService winnerService;

    @GetMapping
    public List<WinnerDTO> getWinners() {
        return winnerService.getWinners();
    }
}