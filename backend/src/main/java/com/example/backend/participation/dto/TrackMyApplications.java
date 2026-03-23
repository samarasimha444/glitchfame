package com.example.backend.participation.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public interface TrackMyApplications {

    UUID getParticipationId();          // participation id

    String getParticipantName();        // p.name

    String getParticipantPhotoUrl();    // p.photo_url

    String getStatus();                 // p.status

    String getSeasonName();             // s.name

    LocalDateTime getRegistrationStartDate(); // s.registration_start_date

    LocalDateTime getRegistrationEndDate();   // s.registration_end_date

    LocalDateTime getVotingStartDate();       // s.voting_start_date

    LocalDateTime getVotingEndDate();         // s.voting_end_date
}