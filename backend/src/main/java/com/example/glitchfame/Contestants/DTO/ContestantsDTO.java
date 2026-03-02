package com.example.glitchfame.Contestants.DTO;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public interface ContestantsDTO {

    Long getParticipationId();
    String getParticipantName();
    String getParticipantPhotoUrl();
    LocalDate getDateOfBirth();
    String getLocation();
    String getDescription();
    Long getUserId();
    Long getSeasonId();
    String getSeasonName();
    BigDecimal getPrizeMoney();
    Long getVoteCount();
    Integer getHasVoted();
    String getSeasonPhotoUrl();
    LocalDateTime getRegistrationStartDate();
    LocalDateTime getRegistrationEndDate();
    LocalDateTime getVotingStartDate();
    LocalDateTime getVotingEndDate();
}