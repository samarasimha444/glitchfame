package com.example.backend.votes.user.dto;

import java.util.UUID;

public record ActionDTO(
        UUID participationId,
        UUID seasonId,
        String action // VOTE / KILL
) {}