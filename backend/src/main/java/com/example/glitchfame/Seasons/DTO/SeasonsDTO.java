package com.example.glitchfame.Seasons.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface SeasonsDTO {

    Long getSeasonId();
    String getSeasonName();
    BigDecimal getPrizeMoney();
    String getSeasonPhotoUrl();

    LocalDateTime getRegistrationStartDate();
    LocalDateTime getRegistrationEndDate();
    LocalDateTime getVotingStartDate();
    LocalDateTime getVotingEndDate();

    String getParticipationStatus();
}