package com.example.backend.seasons.dto;

import java.time.Instant;
import java.util.UUID;

public interface SeasonDetails {

    UUID getSeasonId();

    String getSeasonName();

    String getSeasonDesc();

    String getSeasonPhotoUrl();

    String getPrizeMoney();

    Instant getRegistrationStartDate();

    Instant getRegistrationEndDate();

    Instant getVotingStartDate();

    Instant getVotingEndDate();


    Boolean getSeasonLock();

    String getParticipationStatus();
}