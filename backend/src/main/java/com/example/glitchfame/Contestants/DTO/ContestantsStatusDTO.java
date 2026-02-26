package com.example.glitchfame.Contestants.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public interface ContestantsStatusDTO {

    Long getParticipationId();
    String getParticipantName();
    String getPhotoUrl();
    LocalDate getDateOfBirth();
    String getLocation();
    String getDescription();
    Long getUserId();
    Long getSeasonId();
    String getSeasonName();
    BigDecimal getPrizeMoney();
    String getParticipantPhotoUrl();
    String getSeasonPhotoUrl();
    LocalDateTime getRegistrationStartDate();
    LocalDateTime getRegistrationEndDate();
    LocalDateTime getVotingStartDate();
    LocalDateTime getVotingEndDate();

    
}