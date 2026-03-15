package com.example.backend.votes.dto;

import java.util.UUID;

public record VoteUpdateDTO(
        UUID participationId,
        long votes
) {}