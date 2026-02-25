package com.example.glitchfame.Participations;

import com.example.glitchfame.Auth.Entity.User;
import com.example.glitchfame.Seasons.Seasons;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "participations",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_season",
                        columnNames = {"user_id", "season_id"}
                )
        },
        indexes = {
                @Index(name = "idx_participation_user_id", columnList = "user_id"),
                @Index(name = "idx_participation_season_id", columnList = "season_id"),
                @Index(name = "idx_participation_location", columnList = "location"),
                @Index(name = "idx_participation_dob", columnList = "date_of_birth")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many participations -> One user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Many participations -> One season
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    private Seasons season;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(name = "photo_url", nullable = false, length = 500)
    private String photoUrl;
}