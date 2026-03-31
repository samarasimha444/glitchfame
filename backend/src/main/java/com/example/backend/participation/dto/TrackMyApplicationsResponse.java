package com.example.backend.participation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class TrackMyApplicationsResponse {

    UUID participationId;
    UUID seasonId;

    String participantName;
    String participantPhotoUrl;
    String status;

    String seasonName;

    LocalDateTime registrationStartDate;
    LocalDateTime registrationEndDate;
    LocalDateTime votingStartDate;
    LocalDateTime votingEndDate;

    int votes;
    int kills;
    long score;
    Integer rank; // nullable
}