package com.example.glitchfame.Votes.DTO;

public record VoteResponse(
        Long participationId,
        Long voteCount,
        Boolean hasVoted
) {}