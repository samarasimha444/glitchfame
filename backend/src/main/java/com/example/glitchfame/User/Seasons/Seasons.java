package com.example.glitchfame.User.Seasons;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(
        name = "seasons",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_seasons_name", columnNames = "name")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seasons {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "prize_money", nullable = false, precision = 15, scale = 2)
    private BigDecimal prizeMoney;

    @Column(name = "registration_start_date", nullable = false)
    private Instant registrationStartDate;

    @Column(name = "registration_end_date", nullable = false)
    private Instant registrationEndDate;

    @Column(name = "voting_start_date", nullable = false)
    private Instant votingStartDate;

    @Column(name = "voting_end_date", nullable = false)
    private Instant votingEndDate;

    @Column(name = "photo_url", length = 255)
    private String photoUrl;

    @Column(name = "vote_lock", nullable = false)
    private boolean voteLock = false;

    @Column(name = "participation_lock", nullable = false)
    private boolean participationLock = false;

    @Column(name = "season_lock", nullable = false)
    private boolean seasonLock = false;

    @Column(name = "season_desc", columnDefinition = "TEXT")
    private String seasonDesc;
}