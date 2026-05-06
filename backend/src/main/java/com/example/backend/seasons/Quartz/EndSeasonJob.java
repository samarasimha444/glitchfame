package com.example.backend.seasons.Quartz;

import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.backend.seasons.seasonService;

import java.time.Instant;
import java.util.UUID;

@Component
public class EndSeasonJob implements Job {

    @Autowired
    private seasonService SeasonService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {

        String seasonId = context.getMergedJobDataMap().getString("seasonId");

        System.out.println("🔥 Executing EndSeasonJob for: " + seasonId);

        try {
            SeasonService.endSeason(
                    UUID.fromString(seasonId),
                    Instant.now()
            );

        } catch (Exception e) {
            System.err.println("❌ Job failed, retrying: " + e.getMessage());

            // 🔥 retry immediately
            throw new JobExecutionException(e, true);
        }
    }
}