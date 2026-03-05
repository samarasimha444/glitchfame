package com.example.glitchfame.Winner;

import com.example.glitchfame.User.Seasons.Seasons;
import com.example.glitchfame.Admin.Seasons.AdminSeasonRepository;


import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeasonFinalizerService {

    private final AdminSeasonRepository seasonRepository;
    private final WinnerRepository winnerRepository;

    @Transactional
    public void finalizeSeasons() {

        List<Seasons> seasons = seasonRepository.findSeasonsToFinalize();

        for (Seasons season : seasons) {

            Long seasonId = season.getId();

            // insert winners into winner table
            winnerRepository.insertSeasonWinners(seasonId);

            // lock season so scheduler won't run again
            season.setSeasonLock(true);

            seasonRepository.save(season);
        }
    }
}