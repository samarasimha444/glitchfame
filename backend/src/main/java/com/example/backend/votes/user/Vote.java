package com.example.backend.votes.user;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
    name = "votes",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"participation_id","auth_id","action"}
    )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vote {

    @Id
    @GeneratedValue
    @Column(name = "vote_id")
    private UUID voteId;

    @Column(name = "participation_id", nullable = false)
    private UUID participationId;

    @Column(name = "auth_id", nullable = false)
    private UUID authId;

    @Column(name = "action", nullable = false)
    private String action; // VOTE / KILL
}