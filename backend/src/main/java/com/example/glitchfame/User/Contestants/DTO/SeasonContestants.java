package com.example.glitchfame.User.Contestants.DTO;
import java.time.LocalDate;
import java.time.LocalDateTime;


//DTO for returning contestant details for a specific season, including voting status and total votes
public interface SeasonContestants {
    Long getId();
    Long getUserId();
    Long getSeasonId();

    String getName();
    String getDescription();
    String getStatus();
    LocalDate getDateOfBirth();
    String getLocation();
    String getPhotoUrl();

    String getSeasonName();
    Long getPrizeMoney();
    String getSeasonPhotoUrl();
    LocalDateTime getRegistrationStartDate();
    LocalDateTime getRegistrationEndDate();
    LocalDateTime getVotingStartDate();
    LocalDateTime getVotingEndDate();

    Long getTotalVotes();
    Integer getHasVoted();

} 
