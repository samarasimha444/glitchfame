package com.example.backend.participation.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public interface TrackMyApplications {

    UUID getParticipationId();

    UUID getSeasonId(); // 🔥 REQUIRED

    String getParticipantName();

    String getParticipantPhotoUrl();

    String getStatus();

    String getSeasonName();

    LocalDateTime getRegistrationStartDate();

    LocalDateTime getRegistrationEndDate();

    LocalDateTime getVotingStartDate();

    LocalDateTime getVotingEndDate();

    Integer getVotes();
    Integer getKills();
    Long getScore();
    Integer getRank();
}