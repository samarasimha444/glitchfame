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
    private final seasonService seasonService; // fix naming (capital S)

    @Scheduled(fixedRate = 60000 *10)
    public void checkEndedSeasons() {

        Instant now = Instant.now();

        // ✅ ONLY fetch seasons that:
        // 1. voting ended
        // 2. not yet processed
        List<Season> seasons =
                seasonRepo.findByVotingEndDateBeforeAndSeasonEndedFalse(now);

        if (seasons.isEmpty()) {
            return; // nothing to process
        }

        for (Season season : seasons) {
            try {
                seasonService.endSeason(
                        season.getSeasonId(),
                        now
                );
            } catch (Exception e) {
                // ❌ don’t let one failure break scheduler
                System.err.println("Failed to end season: " + season.getSeasonId());
                e.printStackTrace();
            }
        }
    }
}