package com.example.glitchfame.Winner;
import lombok.RequiredArgsConstructor;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class SeasonScheduler {

    private final WinnerService seasonFinalizerService;

    // runs every 60 seconds
    @Scheduled(fixedRate = 60000)
    public void finalizeSeasonJob() {

        seasonFinalizerService.finalizeSeasons();

    }
} 