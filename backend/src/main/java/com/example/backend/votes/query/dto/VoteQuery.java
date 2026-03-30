package com.example.backend.votes.query.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class  VoteQuery {

    private long score;
    private long rank;
    private int voteCount;
    private int killCount;
    private boolean hasVoted;
    private boolean hasKilled;
}