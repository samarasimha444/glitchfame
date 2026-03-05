package com.example.glitchfame.Winner;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "season_winners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeasonWinner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "season_id")
    private Long seasonId;

    @Column(name = "season_name")
    private String seasonName;

    @Column(name = "contestant_id")
    private Long contestantId;

    @Column(name = "contestant_name")
    private String contestantName;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "prize_money")
    private BigDecimal prizeMoney;

    @Column(name = "total_votes")
    private int totalVotes;
}