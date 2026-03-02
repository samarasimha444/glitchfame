package com.example.glitchfame.Seasons.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface SeasonDetailsDTO {

     Long getId();
     String getName();
     BigDecimal getPrizeMoney();
     LocalDateTime getRegistrationStartDate();
     LocalDateTime getRegistrationEndDate();
     LocalDateTime getVotingStartDate();
     LocalDateTime getVotingEndDate();
     String getPhotoUrl();
     String getParticipationStatus(); // can be null
     Boolean getVoteLock();
    Boolean getParticipationLock();
    Boolean getSeasonLock();

     
}