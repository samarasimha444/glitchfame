package com.example.backend.participation.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record ParticipantById(

        UUID participationId,
        String participantName,
        String participantPhotoUrl,

        LocalDate dateOfBirth,
        String location,
        String description,

        String status,

        UUID seasonId,
        String seasonName,
        BigDecimal prizeMoney,

        long score,
        long rank,
        int voteCount,
        int killCount,
        boolean hasVoted,
        boolean hasKilled,

        String seasonPhotoUrl,

        LocalDateTime registrationStartDate,
        LocalDateTime registrationEndDate,
        LocalDateTime votingStartDate,
        LocalDateTime votingEndDate
) {}