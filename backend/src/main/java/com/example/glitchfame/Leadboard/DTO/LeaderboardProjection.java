package com.example.glitchfame.Leadboard.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public interface LeaderboardProjection {

    Long getParticipation_id();
    Long getUser_id();
    Long getSeason_id();
    String getParticipant_name();
    String getDescription();
    String getStatus();
    LocalDate getDate_of_birth();
    String getLocation();
    String getPhoto_url();
    LocalDateTime getCreated_at();

    String getSeason_name();
    BigDecimal getPrize_money();
    LocalDateTime getRegistration_start_date();
    LocalDateTime getRegistration_end_date();
    LocalDateTime getVoting_start_date();
    LocalDateTime getVoting_end_date();
    String getSeason_photo_url();

    Long getVote_count();
    Integer getHas_voted();
    Long getRank_position();
}