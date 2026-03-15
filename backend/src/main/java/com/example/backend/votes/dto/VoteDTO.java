package com.example.backend.votes.dto;

import java.util.UUID;

public record VoteDTO(
        UUID participationId,
        UUID seasonId
) {}