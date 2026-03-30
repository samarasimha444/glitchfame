package com.example.backend.participation.dto.base;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public interface ParticipantByIdBase {

    UUID getParticipationId();
    String getParticipantName();
    String getParticipantPhotoUrl();

    LocalDate getDateOfBirth();
    String getLocation();
    String getDescription();

    String getStatus();

    UUID getSeasonId();
    String getSeasonName();
    BigDecimal getPrizeMoney();

    String getSeasonPhotoUrl();

    Instant getRegistrationStartDate();
    Instant getRegistrationEndDate();
    Instant getVotingStartDate();
    Instant getVotingEndDate();
}