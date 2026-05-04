package com.example.backend.seasons.Quartz;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import jakarta.annotation.PostConstruct;

import org.quartz.JobKey;
import org.springframework.stereotype.Component;

import com.example.backend.seasons.Season;
import com.example.backend.seasons.SeasonRepo;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SeasonStartupRecovery {

    private final SeasonRepo seasonRepository;
    private final QuartzSchedulerService schedulerService;

    @PostConstruct
    public void recover() {

        Instant now = Instant.now();

        // ================= 🔥 1. MISSED JOBS =================
        List<Season> expired = seasonRepository
                .findByVotingEndDateBeforeAndSeasonEndedFalse(now);

        for (Season s : expired) {
            // run immediately (will be idempotent)
            schedulerService.scheduleSeasonEnd(s.getSeasonId(), now);
        }

        // ================= ⏳ 2. FUTURE JOBS =================
        // We don't have direct repo method → filter manually
        List<Season> all = seasonRepository.findAll();

        for (Season s : all) {

            // skip already ended
            if (s.isSeasonEnded()) continue;

            // only future jobs
            if (s.getVotingEndDate().isAfter(now)) {

                UUID seasonId = s.getSeasonId();

                try {
                    // avoid duplicate scheduling
                    if (!schedulerService.exists(seasonId)) {

                        schedulerService.scheduleSeasonEnd(
                                seasonId,
                                s.getVotingEndDate()
                        );
                    }

                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }
}