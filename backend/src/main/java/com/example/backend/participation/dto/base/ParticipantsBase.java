package com.example.backend.participation.dto.base;

import java.util.UUID;

public record ParticipantsBase(
        UUID participationId,
        String participantName,
        String participantPhotoUrl,
        UUID seasonId
) {}