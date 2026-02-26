package com.example.glitchfame.Contestants.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;

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
}