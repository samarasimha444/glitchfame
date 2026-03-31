package com.example.backend.votes.user.dto;

public record VoteResponseDTO(
    String type,
    long score
) {}