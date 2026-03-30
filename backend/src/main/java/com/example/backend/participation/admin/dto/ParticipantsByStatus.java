package com.example.backend.participation.admin.dto;

import java.util.UUID;

public interface ParticipantsByStatus {

    UUID getParticipationId();
    String getParticipantName();
    String getParticipantPhotoUrl();
    String getSeasonName();

    UUID getSeasonId();
    String getStatus();

    Long getScore();
    Long getRank();
    Boolean getHasVoted();
    Boolean getHasKilled();
}