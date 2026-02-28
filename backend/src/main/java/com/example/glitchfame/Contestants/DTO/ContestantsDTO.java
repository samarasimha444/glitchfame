package com.example.glitchfame.Contestants.DTO;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


//DTO for returning contestant details in various contexts (e.g., by season, by name, etc.)
public interface ContestantsDTO {

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
    Long getVoteCount();
    String getParticipantPhotoUrl();
    String getSeasonPhotoUrl();
    Integer getHasVoted();
    LocalDateTime getRegistrationStartDate();
    LocalDateTime getRegistrationEndDate();
    LocalDateTime getVotingStartDate();
    LocalDateTime getVotingEndDate();


}
