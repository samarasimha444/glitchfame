package com.example.backend.votes.async.dto;

import java.util.UUID;

public record Broadcast(
        UUID participationId,
        long score
) {}