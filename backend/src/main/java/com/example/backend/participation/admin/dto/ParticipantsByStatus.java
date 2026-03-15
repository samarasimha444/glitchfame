package com.example.backend.participation.admin.dto;

import java.util.UUID;

public interface ParticipantsByStatus {

    UUID getParticipationId();   // participant id
    String getParticipantName(); // name
    String getParticipantPhotoUrl(); // photo url
    String getSeasonName(); // season name
    Integer getTotalVotes(); // total votes
}