package com.example.glitchfame.Votes;

import com.example.glitchfame.Auth.Entity.User;
import com.example.glitchfame.Participations.Participation;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "votes",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_votes_unique_vote",
                        columnNames = {"contestant_id", "voter_id"}
                )
        },
        indexes = {
                @Index(name = "idx_votes_contestant", columnList = "contestant_id"),
                @Index(name = "idx_votes_voter", columnList = "voter_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many votes -> One participation
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contestant_id", nullable = false)
    private Participation contestant;

    // Many votes -> One user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voter_id", nullable = false)
    private User voter;
}