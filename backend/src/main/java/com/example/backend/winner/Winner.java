package com.example.backend.winner;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Winner {

    @Id
    @GeneratedValue
    private UUID id;

    private String participantName;

    private LocalDate dob;

    private String location;

    private String description;

    private String participantPhoto;

    private Long totalVotes;

    private String seasonName;

    private Instant seasonEndingDate;

}