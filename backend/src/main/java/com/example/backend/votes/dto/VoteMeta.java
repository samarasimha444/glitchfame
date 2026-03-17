package com.example.backend.votes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VoteMeta {

    private long votes;       // total votes from ZSET
    private boolean hasVoted; // user vote from SET
}