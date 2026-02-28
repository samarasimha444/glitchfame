package com.example.glitchfame.Contestants.DTO;
import java.time.LocalDate;


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

    Long getTotalVotes();

    Integer getHasVoted();

} 
