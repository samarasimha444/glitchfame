package com.example.glitchfame.Contestants.DTO;
import java.time.LocalDate;

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
