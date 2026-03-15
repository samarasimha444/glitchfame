package com.example.backend.votes;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "votes",
       uniqueConstraints = @UniqueConstraint(columnNames = {"participation_id","auth_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vote {

    @Id
    @GeneratedValue
    @Column(name = "vote_id")
    private UUID voteId; // primary key

    @Column(name = "participation_id", nullable = false)
    private UUID participationId; // participant id

    @Column(name = "auth_id", nullable = false)
    private UUID authId; // voter id
}