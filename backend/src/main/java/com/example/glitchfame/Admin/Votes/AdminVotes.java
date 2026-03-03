package com.example.glitchfame.Admin.Votes;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin_votes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminVotes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "participation_id", nullable = false, unique = true)
    private Long participationId;

    @Column(name = "admin_vote_count", nullable = false)
    private int adminVoteCount;
}