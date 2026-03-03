package com.example.glitchfame.User.Votes.DTO;

public record VoteResponse(
        Long participationId,
        Long voteCount,
        Boolean hasVoted
) {}