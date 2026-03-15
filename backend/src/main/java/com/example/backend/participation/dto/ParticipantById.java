package com.example.backend.participation.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public interface ParticipantById {

    UUID getParticipationId();
    String getParticipantName();
    String getParticipantPhotoUrl();

    LocalDate getDateOfBirth();
    String getLocation();
    String getDescription();

    String getStatus(); // participation status

    UUID getSeasonId();
    String getSeasonName();
    BigDecimal getPrizeMoney();

    Long getVoteCount();
    Boolean getHasVoted();

    String getSeasonPhotoUrl();

    LocalDateTime getRegistrationStartDate();
    LocalDateTime getRegistrationEndDate();
    LocalDateTime getVotingStartDate();
    LocalDateTime getVotingEndDate();
}