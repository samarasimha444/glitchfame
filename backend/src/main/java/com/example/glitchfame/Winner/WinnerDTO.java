package com.example.glitchfame.Winner;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WinnerDTO {

    private Long seasonId;

    private String seasonName;

    private Long contestantId;

    private String contestantName;

    private String photoUrl;

    private BigDecimal prizeMoney;

    private int totalVotes;
}