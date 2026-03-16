package com.example.backend.seasons;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeasonScheduler {

    private final SeasonRepo seasonRepo;
    private final seasonService seasonService;

    @Scheduled(fixedRate = 60000)
    public void checkEndedSeasons() {

        Instant now = Instant.now();

        List<Season> seasons =
                seasonRepo.findByVotingEndDateBefore(now);

        for (Season season : seasons) {

            seasonService.endSeason(
                    season.getSeasonId(),
                    now
            );
        }
    }
}