package com.example.backend.participation.dto;

import java.util.UUID;

public record Participants(
        UUID participationId,
        String participantName,
        String participantPhotoUrl,
        UUID seasonId,
        long score,
        Long rank,
        Integer voteCount,
        Integer killCount,
        Boolean hasVoted,
        Boolean hasKilled
) {}