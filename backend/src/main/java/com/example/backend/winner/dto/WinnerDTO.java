package com.example.backend.winner.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class WinnerDTO {

    private UUID seasonId;          // season identifier
    private String seasonName;      // season name

    private UUID participationId;  // winner id
    private String participantName;// winner name
    private String photoUrl;        // profile image

    private Long score;             // final score
    private Integer rank;           // should always be 1
}