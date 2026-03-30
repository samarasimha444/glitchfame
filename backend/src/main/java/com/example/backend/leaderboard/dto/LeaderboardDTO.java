package com.example.backend.leaderboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class LeaderboardDTO {

    private UUID seasonId;
    private String seasonName;

    private UUID participantId;
    private String participantName;
    private String participantPhoto;

    private int score;
    private int rank;
}