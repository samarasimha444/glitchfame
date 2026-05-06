package com.example.backend.seasons.Quartz;

import java.sql.Date;
import java.time.Instant;
import java.util.UUID;

import org.quartz.*;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuartzSchedulerService {

    private final Scheduler scheduler;

    // ================= SCHEDULE =================
    public void scheduleSeasonEnd(UUID seasonId, Instant endTime) {

        try {
            JobKey jobKey = new JobKey(seasonId.toString());

            // 🔥 avoid duplicate job creation
            if (scheduler.checkExists(jobKey)) {
                return;
            }

            JobDetail jobDetail = JobBuilder.newJob(EndSeasonJob.class)
                    .withIdentity(jobKey)
                    .usingJobData("seasonId", seasonId.toString())
                    .storeDurably()
                    .build();

            Trigger trigger = TriggerBuilder.newTrigger()
                    .withIdentity("trigger_" + seasonId)
                    .forJob(jobDetail)
                    .startAt(Date.from(endTime))
                    .withSchedule(
                        SimpleScheduleBuilder.simpleSchedule()
                                .withMisfireHandlingInstructionFireNow() // 🔥 KEY
                    )
                    .build();

            scheduler.scheduleJob(jobDetail, trigger);

        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }

    // ================= RESCHEDULE =================
    public void rescheduleSeason(UUID seasonId, Instant newEndTime) {

        try {
            JobKey jobKey = new JobKey(seasonId.toString());

            if (scheduler.checkExists(jobKey)) {
                scheduler.deleteJob(jobKey); // remove old job + trigger
            }

            scheduleSeasonEnd(seasonId, newEndTime);

        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }

    // ================= EXISTS =================
    public boolean exists(UUID seasonId) {
        try {
            return scheduler.checkExists(new JobKey(seasonId.toString()));
        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }
}